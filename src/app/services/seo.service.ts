import { DOCUMENT, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, PLATFORM_ID, RendererFactory2, ViewEncapsulation } from '@angular/core';
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
    /** http status */
    private readonly httpStatus$ = new Subject<HttpStatusModel>();

    /**
     * constructor of SeoService
     * @param meta: Meta
     * @param titleService: Title
     * @param router: Router
     * @param rendererFactory: RendererFactory2
     * @param platformLocation: PlatformLocation
     * @param platformId: PLATFORM_ID
     * @param appConfig: APP_CONFIG
     * @param locale: LOCALE_ID
     * @param document: DOCUMENT
     */
    constructor(private readonly meta: Meta,
                private readonly titleService: Title,
                private readonly router: Router,
                private readonly rendererFactory: RendererFactory2,
                private readonly platformLocation: PlatformLocation,
                @Inject(PLATFORM_ID) private readonly platformId: string,
                @Inject(APP_CONFIG) private readonly appConfig: InterfaceAppConfig,
                @Inject(LOCALE_ID) private readonly locale: string,
                @Inject(DOCUMENT) public document) {
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
        this.meta.updateTag({itemprop: 'name', content: tempPage.title});

        this.updateLink({rel: 'canonical', href: `${protocol}${host}${slug}`});

        this.meta.updateTag({name: 'description', content: tempPage.description});
        this.meta.updateTag({itemprop: 'description', content: tempPage.description});
        if (tempPage.image) {
            this.meta.updateTag({itemprop: 'image', content: tempPage.image});
        }

        Object.keys(tempPage.seo.tw)
            .forEach((prop: string) => {
                this.meta.updateTag({name: prop, content: tempPage.seo.tw[prop]});
            });
        this.meta.updateTag({property: 'og:url', content: `${protocol}//${host}${slug}`});
        this.meta.updateTag({property: 'og:locale', content: cultureCode});
        Object.keys(tempPage.seo.og)
            .forEach((prop: string) => {
                this.meta.updateTag({property: prop, content: tempPage.seo.og[prop]});
            });
        Object.keys(tempPage.seo.custom)
            .forEach((prop: string) => {
                this.meta.updateTag({name: prop, content: tempPage.seo.custom[prop]});
            });
        for (const langAlternate of tempPage.seo.localeAlternates) {
            this.meta.updateTag({property: 'og:locale:alternate', content: langAlternate.cultureCode});
            this.updateLink({
                rel: 'alternate',
                href: `${protocol}//${host}${langAlternate.slug}`,
                hreflang: langAlternate.languageCode
            });
        }

        if (!tempPage.seo.tw['twitter:site'] && environment.defaultData['twitter:site']) {
            this.meta.updateTag({name: 'twitter:site', content: environment.defaultData['twitter:site']});
        }
        if (!tempPage.seo.tw['twitter:creator'] && environment.defaultData['twitter:creator']) {
            this.meta.updateTag({name: 'twitter:creator', content: environment.defaultData['twitter:creator']});
        }
        if (!tempPage.seo.og['fb:app_id'] && environment.defaultData['fb:app_id']) {
            this.meta.updateTag({property: 'fb:app_id', content: environment.defaultData['fb:app_id']});
        }
        if (!tempPage.seo.og['fb:admins'] && environment.defaultData['fb:admins']) {
            this.meta.updateTag({property: 'fb:admins', content: environment.defaultData['fb:admins']});
        }

        this.meta.updateTag({name: 'apple-mobile-web-app-title', content: tempPage.title});
        this.meta.updateTag({httpEquiv: 'Content-Language', content: languageCode});

        this.updateLink({
            rel: 'alternate',
            href: `${protocol}//${host}${slug}`,
            hreflang: 'x-default'
        });
    }

    /**
     * add or update link to head of document
     * @param linkObject: tags of link
     */
    updateLink(linkObject: HtmlLinkElementModel): void {
        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const link = renderer.createElement('link');

            const head = this.document.head;

            // istanbul ignore if
            if (head === null) {
                return; // <head> not found within DOCUMENT
            }

            Object.keys(linkObject)
                .forEach((prop: string) => {
                    renderer.setAttribute(link, prop, linkObject[prop]);
                });

            // istanbul ignore next
            const attr: string = linkObject.rel ? 'rel' : 'hreflang';
            const attrSelector = `${attr}="${linkObject[attr]}"`;
            const linkTags = this.document.querySelectorAll(`link[${attrSelector}]`);
            for (const oldLink of linkTags) {
                renderer.removeChild(head, oldLink);
            }
            renderer.appendChild(head, link);
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
