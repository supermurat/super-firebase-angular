import { DOCUMENT, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { APP_CONFIG, InterfaceAppConfig } from '../app-config';
import { HtmlLinkElementModel, HttpStatusModel, PageBaseModel } from '../models';

/**
 * Seo Service
 */
@Injectable()
export class SeoService {
    /** Renderer2 object */
    renderer: Renderer2;
    /** http status */
    private readonly httpStatus$ = new Subject<HttpStatusModel>();

    /**
     * constructor of SeoService
     * @param meta: Meta
     * @param titleService: Title
     * @param router: Router
     * @param platformLocation: PlatformLocation
     * @param platformId: PLATFORM_ID
     * @param appConfig: APP_CONFIG
     * @param locale: LOCALE_ID
     * @param doc: DOCUMENT
     */
    constructor(private readonly meta: Meta,
                private readonly titleService: Title,
                private readonly router: Router,
                private readonly platformLocation: PlatformLocation,
                @Inject(PLATFORM_ID) private readonly platformId: string,
                @Inject(APP_CONFIG) private readonly appConfig: InterfaceAppConfig,
                @Inject(LOCALE_ID) private readonly locale: string,
                @Inject(DOCUMENT) public doc) {
    }

    /**
     * Set Html Tags
     * @param page: current page
     */
    setHtmlTags(page: PageBaseModel): void {
        const tempPage = {
            ...{seo: {localeAlternates: [], custom: {}, tw: {}, og: {}}},
            ...page};
        for (const key of ['localeAlternates', 'custom', 'tw', 'og']) {
            if (Object.keys(tempPage.seo)
                .indexOf(key) === -1) {
                tempPage.seo[key] = key === 'localeAlternates' ? [] : {};
            }
        }
        const protocol = environment.protocol;
        const host = environment.host;
        const cultureCode = this.locale;
        const languageCode = this.locale.substr(0, 2);
        const slug = this.platformLocation.pathname;

        this.titleService.setTitle(tempPage.title);
        this.meta.updateTag({itemprop: 'name', content: tempPage.title}, "itemprop='name'");

        this.updateLink({rel: 'canonical', href: `${protocol}${host}${slug}`}, "link[rel='canonical']");

        this.meta.updateTag({name: 'description', content: tempPage.description}, "name='description'");
        this.meta.updateTag({itemprop: 'description', content: tempPage.description}, "itemprop='description'");
        if (tempPage.image) {
            this.meta.updateTag({itemprop: 'image', content: tempPage.image.src}, "itemprop='image'");
        } else {
            this.meta.removeTag("itemprop='image'");
        }

        Object.keys(tempPage.seo.tw)
            .forEach((prop: string) => {
                this.meta.updateTag({name: prop, content: tempPage.seo.tw[prop]}, `name='${prop}'`);
                // TODO: clear added tags on next page
            });
        this.meta.updateTag({property: 'og:url', content: `${protocol}${host}${slug}`}, "property='og:url'");
        this.meta.updateTag({property: 'og:locale', content: cultureCode.replace('-', '_')},
            "property='og:locale'");
        Object.keys(tempPage.seo.og)
            .forEach((prop: string) => {
                this.meta.updateTag({property: prop, content: tempPage.seo.og[prop]}, `property='${prop}'`);
                // TODO: clear added tags on next page
            });
        Object.keys(tempPage.seo.custom)
            .forEach((prop: string) => {
                this.meta.updateTag({name: prop, content: tempPage.seo.custom[prop]}, `name='${prop}'`);
                // TODO: clear added tags on next page
            });

        this.meta.removeTag("name='twitter:site'");
        this.meta.removeTag("name='twitter:creator'");
        this.meta.removeTag("property='fb:app_id'");
        this.meta.removeTag("property='fb:admins'");
        if (!tempPage.seo.tw['twitter:site'] && environment.defaultData['twitter:site']) {
            this.meta.updateTag({name: 'twitter:site', content: environment.defaultData['twitter:site']},
                "name='twitter:site'");
        }
        if (!tempPage.seo.tw['twitter:creator'] && environment.defaultData['twitter:creator']) {
            this.meta.updateTag({name: 'twitter:creator', content: environment.defaultData['twitter:creator']},
                "name='twitter:creator'");
        }
        if (!tempPage.seo.og['fb:app_id'] && environment.defaultData['fb:app_id']) {
            this.meta.updateTag({property: 'fb:app_id', content: environment.defaultData['fb:app_id']},
                "property='fb:app_id'");
        }
        if (!tempPage.seo.og['fb:admins'] && environment.defaultData['fb:admins']) {
            this.meta.updateTag({property: 'fb:admins', content: environment.defaultData['fb:admins']},
                "property='fb:admins'");
        }

        this.meta.updateTag({name: 'apple-mobile-web-app-title', content: tempPage.title}, "name='apple-mobile-web-app-title'");
        this.meta.updateTag({httpEquiv: 'Content-Language', content: languageCode}, "httpEquiv='Content-Language'");

        this.meta.removeTag("property='og:locale:alternate'");
        this.removeLink("link[rel='alternate']");
        for (const langAlternate of tempPage.seo.localeAlternates) {
            this.meta.updateTag({property: 'og:locale:alternate', content: langAlternate.cultureCode.replace('-', '_')});
            this.updateLink({
                rel: 'alternate',
                href: `${protocol}${host}${langAlternate.slug}`,
                hreflang: langAlternate.cultureCode
            });
        }
        this.updateLink({
            rel: 'alternate',
            href: `${protocol}${host}${slug}`,
            hreflang: 'x-default'
        });
    }

    /**
     * add or update link to head of document
     * @param linkObject: tags of link
     * @param attrSelector: selector to remove old link elements
     */
    updateLink(linkObject: HtmlLinkElementModel, attrSelector?: string): void {
        try {
            this.removeLink(attrSelector);
            const link = this.renderer.createElement('link');
            Object.keys(linkObject)
                .forEach((prop: string) => {
                    this.renderer.setAttribute(link, prop, linkObject[prop]);
                });
            this.renderer.appendChild(this.doc.head, link);
        } catch (e) {
            // console.error('Error within linkService : ', e);
        }
    }

    /**
     * add or remove link from head of document
     * @param attrSelector: selector to remove old link elements
     */
    removeLink(attrSelector?: string): void {
        try {
            for (const oldLink of this.doc.querySelectorAll(attrSelector)) {
                this.renderer.removeChild(this.doc.head, oldLink);
            }
        } catch (e) {
            // console.error('Error within linkService : ', e);
        }
    }

    /**
     * get title of current page
     */
    getTitle(): string {
        return this.titleService.getTitle();
    }

    /**
     * get meta object of current page
     */
    getMeta(): Meta {
        return this.meta;
    }

    /**
     * http 301 redirection
     * @param destinationURL: destination URL
     * @param isExternal: is this url external?
     */
    http301(destinationURL: string, isExternal = false): void {
        const destURL = destinationURL.replace(/[\/]+/g, '/');
        if (isPlatformBrowser(this.platformId)) {
            // istanbul ignore next
            if (isExternal && !this.appConfig.isUnitTest) {
                // this.router.navigate can't work because it is out of base url
                window.location.href = destURL;
            } else {
                this.router.navigate([destURL])
                    .catch(// istanbul ignore next
                        reason => {
                        console.error(reason);
                    });
            }
        } else {
            this.httpStatus$.next({
                code: 301,
                htmlContent: `--http-redirect-301--${destURL}--end-of-http-redirect-301--`
            });
        }
    }

    /**
     * http 404 not found
     */
    http404(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.router.navigate([this.router.url, 'http-404'])
                .catch(// istanbul ignore next
                    reason => {
                    console.error(reason);
                });
        } else {
            this.httpStatus$.next({
                code: 404
            });
        }
    }

    /**
     * get http status
     */
    getHttpStatus(): Observable<HttpStatusModel> {
        return this.httpStatus$.asObservable();
    }
}
