import { DOCUMENT, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, NgZone, PLATFORM_ID, Renderer2, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { APP_CONFIG, InterfaceAppConfig } from '../app-config';
import { ConfigSeoModel, HtmlLinkElementModel, HttpStatusModel, PageBaseModel } from '../models';

/**
 * Seo Service
 */
@Injectable()
export class SeoService {
    /** Renderer2 object */
    renderer: Renderer2;
    /**
     * custom SEO Meta Tags
     * We need to keep them in order to remove them before load tags of next page
     */
    customSEOMetaTags: Array<{
        /** type of meta tag; name or property */
        type: string,
        /** value of name or property, NOT content value */
        value: string}>;

    /** config for SEO */
    configSEO: ConfigSeoModel = {};

    /** http status */
    private readonly httpStatus$ = new Subject<HttpStatusModel>();
    /** json-LD */
    private readonly jsonLD$ = new Subject<SafeHtml>();

    /**
     * constructor of SeoService
     * @param meta: Meta
     * @param titleService: Title
     * @param router: Router
     * @param ngZone: NgZone
     * @param rendererFactory: RendererFactory2
     * @param platformLocation: PlatformLocation
     * @param sanitizer: DomSanitizer
     * @param platformId: PLATFORM_ID
     * @param appConfig: APP_CONFIG
     * @param locale: LOCALE_ID
     * @param doc: DOCUMENT
     */
    constructor(private readonly meta: Meta,
                private readonly titleService: Title,
                private readonly router: Router,
                private readonly ngZone: NgZone,
                private readonly rendererFactory: RendererFactory2,
                private readonly platformLocation: PlatformLocation,
                private readonly sanitizer: DomSanitizer,
                @Inject(PLATFORM_ID) private readonly platformId: string,
                @Inject(APP_CONFIG) private readonly appConfig: InterfaceAppConfig,
                @Inject(LOCALE_ID) private readonly locale: string,
                @Inject(DOCUMENT) public doc) {
    }

    /**
     * Set Html Tags
     * @param page: current page
     */
    setSEOData(page: PageBaseModel): void {
        const tempPage = {...page};
        this.titleService.setTitle(tempPage.title);
        this.meta.updateTag({itemprop: 'name', content: tempPage.title}, "itemprop='name'");
        this.meta.updateTag({name: 'description', content: tempPage.description}, "name='description'");
        this.meta.updateTag({itemprop: 'description', content: tempPage.description}, "itemprop='description'");

        if (tempPage.image) {
            this.meta.updateTag({itemprop: 'image', content: tempPage.image.src}, "itemprop='image'");
        } else {
            this.meta.removeTag("itemprop='image'");
        }

        this.meta.updateTag({name: 'apple-mobile-web-app-title', content: tempPage.title}, "name='apple-mobile-web-app-title'");

        this.setLocalAndUrlHtmlTags(tempPage);
        this.setProjectSpecifiedHtmlTags(tempPage);
        this.setCustomSEOHtmlTags(tempPage);
        this.setJsonLD(tempPage);
    }

    /**
     * Set Locale and Url Html Tags
     * @param tempPage: current page
     */
    setLocalAndUrlHtmlTags(tempPage: PageBaseModel): void {
        if (!tempPage.hasOwnProperty('locales')) {
            // tslint:disable-next-line:no-string-literal
            tempPage['locales'] = [];
        }
        const protocol = environment.protocol;
        const host = environment.host;
        const cultureCode = this.locale;
        const languageCode = this.locale.substr(0, 2);
        const slug = this.platformLocation.pathname;

        tempPage.canonicalUrl = `${protocol}${host}${slug}`;

        this.updateLink({rel: 'canonical', href: tempPage.canonicalUrl}, "link[rel='canonical']");

        this.meta.updateTag({httpEquiv: 'Content-Language', content: languageCode}, "httpEquiv='Content-Language'");

        this.meta.updateTag({property: 'og:url', content: tempPage.canonicalUrl}, "property='og:url'");
        this.meta.updateTag({property: 'og:locale', content: cultureCode.replace('-', '_')},
            "property='og:locale'");

        this.meta.removeTag("property='og:locale:alternate'");
        this.removeLink("link[rel='alternate']");
        for (const langAlternate of tempPage.locales) {
            this.meta.updateTag({property: 'og:locale:alternate', content: langAlternate.cultureCode.replace('-', '_')});
            this.updateLink({
                rel: 'alternate',
                href: `${protocol}${host}/${langAlternate.slug}`,
                hreflang: langAlternate.cultureCode
            });
        }
        this.updateLink({
            rel: 'alternate',
            href: tempPage.canonicalUrl,
            hreflang: cultureCode
        });
        this.updateLink({
            rel: 'alternate',
            href: tempPage.canonicalUrl,
            hreflang: 'x-default'
        });
    }

    /**
     * Set Project Specified Html Tags
     * @param tempPage: current page
     */
    setProjectSpecifiedHtmlTags(tempPage: PageBaseModel): void {
        if (environment.defaultData['twitter:site']) {
            this.meta.updateTag({name: 'twitter:site', content: environment.defaultData['twitter:site']},
                "name='twitter:site'");
        }
        if (environment.defaultData['twitter:creator']) {
            this.meta.updateTag({name: 'twitter:creator', content: environment.defaultData['twitter:creator']},
                "name='twitter:creator'");
        }
        if (environment.defaultData['fb:app_id']) {
            this.meta.updateTag({property: 'fb:app_id', content: environment.defaultData['fb:app_id']},
                "property='fb:app_id'");
        }
        if (environment.defaultData['fb:admins']) {
            this.meta.updateTag({property: 'fb:admins', content: environment.defaultData['fb:admins']},
                "property='fb:admins'");
        }
    }

    /**
     * Set Custom SEO Html Tags
     * @param tempPage: current page
     */
    setCustomSEOHtmlTags(tempPage: PageBaseModel): void {
        if (this.customSEOMetaTags) {
            for (const customSEO of this.customSEOMetaTags) {
                this.meta.removeTag(`${customSEO.type}='${customSEO.value}'`);
            }
        } else {
            this.customSEOMetaTags = [];
        }
        if (tempPage.hasOwnProperty('seo')) {
            if (tempPage.seo.hasOwnProperty('names')) {
                Object.keys(tempPage.seo.names)
                    .forEach((prop: string) => {
                        this.meta.updateTag({name: prop, content: tempPage.seo.names[prop]}, `name='${prop}'`);
                        this.customSEOMetaTags.push({type: 'name', value: prop});
                    });
            }
            if (tempPage.seo.hasOwnProperty('properties')) {
                Object.keys(tempPage.seo.properties)
                    .forEach((prop: string) => {
                        this.meta.updateTag({property: prop, content: tempPage.seo.properties[prop]}, `property='${prop}'`);
                        this.customSEOMetaTags.push({type: 'property', value: prop});
                    });
            }
        }
    }

    /**
     * Get Plaintext by Html
     * @param htmlContent: html content
     */
    getPlaintextByHtml(htmlContent: string): string {
        return htmlContent ? String(htmlContent)
            .replace(/<[^>]+>/gm, '') : '';
    }

    /**
     * Get JSON-LDs by content of current page
     * @param tempPage: current page
     */
    getJsonLDByContentOfCurrentPage(tempPage: any): Array<any> {
        const jsonLDs = [];
        const images = [];
        const image = tempPage.image ? tempPage.image :
            this.configSEO.defaultImageForSEO ? this.configSEO.defaultImageForSEO : undefined;
        if (image) {
            if (image.src1x1) {
                images.push(image.src1x1);
            }
            if (image.src4x3) {
                images.push(image.src4x3);
            }
            if (image.src16x9) {
                images.push(image.src16x9);
            }
            if (image.src) {
                images.push(image.src);
            }
        }
        const publisher = this.configSEO.defaultPublisher ? this.configSEO.defaultPublisher : undefined;
        if (['/quote', '/alinti', 'guzel-soz'].indexOf(tempPage.routePath) > -1 && tempPage.hasOwnProperty('whoSaidThat')) {
            jsonLDs.push({
                '@type': 'Quotation',
                creator: {
                    '@type': 'Person',
                    name: this.getPlaintextByHtml(tempPage.whoSaidThat)
                },
                text: this.getPlaintextByHtml(tempPage.content),
                image: images,
                mainEntityOfPage: tempPage.canonicalUrl
            });
        } else if (['/quote', '/alinti', 'guzel-soz'].indexOf(tempPage.routePath) > -1 && tempPage.hasOwnProperty('persons')) {
            const persons = [];
            Object.keys(tempPage.persons)
                .forEach(key => {
                    persons.push({
                        '@type': 'Person',
                        name: tempPage.persons[key]
                    });
                });
            if (persons.length > 1) {
                jsonLDs.push({
                    '@type': 'Conversation',
                    name: this.getPlaintextByHtml(tempPage.title),
                    hasPart: [
                        {
                            '@type': 'Message',
                            sender: persons[0],
                            recipient: persons[1],
                            about: {
                                '@type': 'Thing',
                                name: '...'
                            },
                            datePublished: new Date(tempPage.created.seconds * 1000)
                        },
                        {
                            '@type': 'Message',
                            sender: persons[1],
                            recipient: persons[0],
                            about: {
                                '@type': 'Thing',
                                name: '...'
                            },
                            datePublished: new Date(tempPage.created.seconds * 1000)
                        }
                    ],
                    text: this.getPlaintextByHtml(tempPage.content),
                    image: images,
                    mainEntityOfPage: tempPage.canonicalUrl
                });
            }
        } else if (['/blog', '/gunluk'].indexOf(tempPage.routePath) > -1) {
            jsonLDs.push({
                '@type': 'BlogPosting',
                author: {
                    '@type': 'Person',
                    name: this.getPlaintextByHtml(tempPage.createdBy)
                },
                publisher: {...{'@type': 'Organization'}, ...publisher},
                dateCreated: new Date(tempPage.created.seconds * 1000),
                dateModified: new Date(tempPage.changed.seconds * 1000),
                datePublished: new Date(tempPage.created.seconds * 1000),
                headline: this.getPlaintextByHtml(tempPage.title),
                description: tempPage.description,
                image: images,
                mainEntityOfPage: tempPage.canonicalUrl
            });
        } else if (['/article', '/makale'].indexOf(tempPage.routePath) > -1) {
            jsonLDs.push({
                '@type': 'Article',
                author: {
                    '@type': 'Person',
                    name: this.getPlaintextByHtml(tempPage.createdBy)
                },
                publisher: {...{'@type': 'Organization'}, ...publisher},
                dateCreated: new Date(tempPage.created.seconds * 1000),
                dateModified: new Date(tempPage.changed.seconds * 1000),
                datePublished: new Date(tempPage.created.seconds * 1000),
                headline: this.getPlaintextByHtml(tempPage.title),
                description: tempPage.description,
                image: images,
                mainEntityOfPage: tempPage.canonicalUrl
            });
        } else if (['/joke', '/eglence', '/fikra', '/saka', '/espri', '/soguk-espri'].indexOf(tempPage.routePath) > -1) {
            jsonLDs.push({
                '@type': 'SocialMediaPosting',
                author: {
                    '@type': 'Person',
                    name: this.getPlaintextByHtml(tempPage.createdBy)
                },
                publisher: {...{'@type': 'Organization'}, ...publisher},
                dateCreated: new Date(tempPage.created.seconds * 1000),
                dateModified: new Date(tempPage.changed.seconds * 1000),
                datePublished: new Date(tempPage.created.seconds * 1000),
                headline: this.getPlaintextByHtml(tempPage.title),
                description: tempPage.description,
                image: images,
                mainEntityOfPage: tempPage.canonicalUrl
            });
        }

        return jsonLDs;
    }

    /**
     * Set JSON-LD
     * @param tempPage: current page
     */
    setJsonLD(tempPage: PageBaseModel): void {
        if (tempPage.hasOwnProperty('jsonLDs')) {
            tempPage.jsonLDs.push(...this.getJsonLDByContentOfCurrentPage(tempPage));
        } else {
            tempPage.jsonLDs = this.getJsonLDByContentOfCurrentPage(tempPage);
        }
        let jsonLDList = '';
        for (const jsonLD of tempPage.jsonLDs) {
            if (jsonLDList !== '') {
                jsonLDList += ',';
            }
            if (!jsonLD.hasOwnProperty('@context')) {
                jsonLD['@context'] = 'http://schema.org/';
            }
            jsonLDList += JSON.stringify(jsonLD, undefined, 0);
        }
        if (jsonLDList) {
            this.jsonLD$.next(this.sanitizer.bypassSecurityTrustHtml(`<script type="application/ld+json">[${jsonLDList}]</script>`));
        } else {
            this.jsonLD$.next(undefined);
        }
    }

    /**
     * add or update link to head of document
     * @param linkObject: tags of link
     * @param attrSelector: selector to remove old link elements
     */
    updateLink(linkObject: HtmlLinkElementModel, attrSelector?: string): void {
        if (this.renderer === undefined) {
            this.renderer = this.rendererFactory.createRenderer(this.doc, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });
        }
        this.removeLink(attrSelector);
        const link = this.renderer.createElement('link');
        Object.keys(linkObject)
            .forEach((prop: string) => {
                this.renderer.setAttribute(link, prop, linkObject[prop]);
            });
        this.renderer.appendChild(this.doc.head, link);
    }

    /**
     * add or remove link from head of document
     * @param attrSelector: selector to remove old link elements
     */
    removeLink(attrSelector: string): void {
        if (attrSelector) {
            for (const oldLink of this.doc.querySelectorAll(attrSelector)) {
                this.renderer.removeChild(this.doc.head, oldLink);
            }
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
                this.ngZone.run(() => {
                    this.router.navigate([destURL])
                        .catch(// istanbul ignore next
                            reason => {
                                console.error(reason);
                            });
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
            this.ngZone.run(() => {
                this.router.navigate([this.router.url, 'http-404'])
                    .catch(// istanbul ignore next
                        reason => {
                            console.error(reason);
                        });
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

    /**
     * get json-LD
     */
    getJsonLD(): Observable<SafeHtml> {
        return this.jsonLD$.asObservable();
    }
}
