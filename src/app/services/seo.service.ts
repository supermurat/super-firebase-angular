import { DOCUMENT, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, PLATFORM_ID, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HtmlDocumentModel, HtmlLinkElementModel, HttpStatusModel } from '../models';

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
     * @param locale: LOCALE_ID
     * @param document: DOCUMENT
     */
    constructor(private readonly meta: Meta,
                private readonly titleService: Title,
                private readonly router: Router,
                private readonly rendererFactory: RendererFactory2,
                private readonly platformLocation: PlatformLocation,
                @Inject(PLATFORM_ID) private readonly platformId: string,
                @Inject(LOCALE_ID) private readonly locale: string,
                @Inject(DOCUMENT) public document) {
    }

    /**
     * Set Html Tags
     * @param currentHtmlTags: html tags of current page
     */
    setHtmlTags(currentHtmlTags: HtmlDocumentModel): void {
        const defaultTags = new HtmlDocumentModel();
        defaultTags.cultureCode = this.locale;
        defaultTags.languageCode = this.locale.substr(0, 2);
        defaultTags.slug =
            this.platformLocation.pathname +
            this.platformLocation.search +
            this.platformLocation.hash;

        defaultTags.twitterTitle = defaultTags.ogTitle = currentHtmlTags.title;
        defaultTags.twitterDescription = defaultTags.ogDescription = currentHtmlTags.description;
        defaultTags.twitterImage = defaultTags.ogImage = currentHtmlTags.image;

        const htmlTags = {...defaultTags, ...currentHtmlTags};

        const protocol = environment.protocol;
        const host = environment.host;

        // set a title
        this.titleService.setTitle(htmlTags.title);
        this.meta.updateTag({itemprop: 'name', content: htmlTags.title});

        this.updateLink({rel: 'canonical', href: `${protocol}//${host}${htmlTags.slug}`});

        this.meta.updateTag({name: 'description', content: htmlTags.description});
        this.meta.updateTag({itemprop: 'description', content: htmlTags.description});
        if (htmlTags.image) {
            this.meta.updateTag({itemprop: 'image', content: htmlTags.image});
        }
        // set meta tags
        if (htmlTags.twitterCard) {
            this.meta.updateTag({name: 'twitter:card', content: htmlTags.twitterCard});
            this.meta.updateTag({name: 'twitter:title', content: htmlTags.twitterTitle});
            this.meta.updateTag({name: 'twitter:description', content: htmlTags.twitterDescription});
            if (htmlTags.twitterImage) {
                this.meta.updateTag({name: 'twitter:image:src', content: htmlTags.twitterImage});
            }
            if (htmlTags.twitterSite) {
                this.meta.updateTag({name: 'twitter:site', content: htmlTags.twitterSite});
            }
            if (htmlTags.twitterCreator) {
                this.meta.updateTag({name: 'twitter:creator', content: htmlTags.twitterCreator});
            }
        }

        if (htmlTags.ogType) {
            this.meta.updateTag({property: 'og:type', content: htmlTags.ogType});
            this.meta.updateTag({property: 'og:title', content: htmlTags.ogTitle});
            this.meta.updateTag({property: 'og:description', content: htmlTags.ogDescription});
            this.meta.updateTag({property: 'og:url', content: `${protocol}//${host}${htmlTags.slug}`});
            this.meta.updateTag({property: 'og:locale', content: htmlTags.cultureCode});
            if (htmlTags.ogSiteName) {
                this.meta.updateTag({property: 'og:site_name', content: htmlTags.ogSiteName});
            }
            if (htmlTags.ogImage) {
                this.meta.updateTag({property: 'og:image', content: htmlTags.ogImage});
            }
        }
        if (htmlTags.articleAuthorURL) {
            this.meta.updateTag({property: 'article:author', content: htmlTags.articleAuthorURL});
        }
        if (htmlTags.articlePublisherURL) {
            this.meta.updateTag({property: 'article:publisher', content: htmlTags.articlePublisherURL});
        }

        if (htmlTags.robots) {
            this.meta.updateTag({name: 'robots', content: htmlTags.robots});
        }
        if (htmlTags.author) {
            this.meta.updateTag({name: 'author', content: htmlTags.author});
        }
        if (htmlTags.owner) {
            this.meta.updateTag({name: 'owner', content: htmlTags.owner});
        }
        if (htmlTags.copyright) {
            this.meta.updateTag({name: 'copyright', content: htmlTags.copyright});
        }

        this.meta.updateTag({name: 'apple-mobile-web-app-title', content: htmlTags.title});
        this.meta.updateTag({httpEquiv: 'Content-Language', content: htmlTags.languageCode});
        if (htmlTags.facebookAppID) {
            this.meta.updateTag({property: 'fb:app_id', content: htmlTags.facebookAppID});
        }
        if (htmlTags.facebookAdmins) {
            this.meta.updateTag({property: 'fb:admins', content: htmlTags.facebookAdmins});
        }
        if (htmlTags.googlePublisher) {
            this.updateLink({rel: 'publisher', href: htmlTags.googlePublisher});
        }

        this.updateLink({
            rel: 'alternate',
            href: `${protocol}//${host}${htmlTags.slug}`,
            hreflang: 'x-default'
        });
        for (const langAlternate of htmlTags.langAlternates) {
            if (htmlTags.ogType) {
                this.meta.updateTag({property: 'og:locale:alternate', content: langAlternate.cultureCode});
            }
            this.updateLink({
                rel: 'alternate',
                href: `${protocol}//${host}${langAlternate.slug}`,
                hreflang: langAlternate.languageCode
            });
        }
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
        if (isPlatformBrowser(this.platformId)) {
            if (isExternal) {
                // this.router.navigate can't work because it is out of base url
                window.location.href = destinationURL;
            } else {
                this.router.navigate([destinationURL])
                    .catch(reason => {
                        console.error(reason);
                    });
            }
        } else {
            this.httpStatus$.next({
                code: 301,
                htmlContent: `--http-redirect-301--${destinationURL}--end-of-http-redirect-301--`
            });
        }
    }

    /**
     * http 404 not found
     */
    http404(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.router.navigate([this.router.url, 'http-404'])
                .catch(reason => {
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
