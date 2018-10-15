import { Inject, Injectable, LOCALE_ID, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { LinkDefinition, TagsDefinition } from '../models';
import { environment } from '../../environments/environment';

/**
 * Seo Service
 */
@Injectable()
export class SeoService {

    /**
     * constructor of SeoService
     * @param meta: Meta
     * @param titleService: Title
     * @param rendererFactory: RendererFactory2
     * @param platformLocation: PlatformLocation
     * @param locale: LOCALE_ID
     * @param document: DOCUMENT
     */
    constructor(private meta: Meta,
                private titleService: Title,
                private rendererFactory: RendererFactory2,
                private platformLocation: PlatformLocation,
                @Inject(LOCALE_ID) private locale: string,
                @Inject(DOCUMENT) public document) {
    }

    /**
     * Generate page tags
     * @param tags: tags of current page
     */
    generateTags(tags: TagsDefinition): void {
        const defaultTags = new TagsDefinition();
        defaultTags.cultureCode = this.locale;
        defaultTags.languageCode = this.locale.substr(0, 2);
        defaultTags.slug =
            this.platformLocation.pathname +
            this.platformLocation.search +
            this.platformLocation.hash;

        defaultTags.twitterTitle = defaultTags.ogTitle = tags.title;
        defaultTags.twitterDescription = defaultTags.ogDescription = tags.description;
        defaultTags.twitterImage = defaultTags.ogImage = tags.image;

        tags = {...defaultTags, ...tags};

        const protocol = environment.protocol;
        const host = environment.host;

        // set a title
        this.titleService.setTitle(tags.title);
        this.meta.updateTag({itemprop: 'name', content: tags.title});

        this.updateLink({rel: 'canonical', href: `${protocol}//${host}${tags.slug}`});

        this.meta.updateTag({name: 'description', content: tags.description});
        this.meta.updateTag({itemprop: 'description', content: tags.description});
        if (tags.image)
            this.meta.updateTag({itemprop: 'image', content: tags.image});
        // set meta tags
        if (tags.twitterCard) {
            this.meta.updateTag({name: 'twitter:card', content: tags.twitterCard});
            this.meta.updateTag({name: 'twitter:title', content: tags.twitterTitle});
            this.meta.updateTag({name: 'twitter:description', content: tags.twitterDescription});
            if (tags.twitterImage)
                this.meta.updateTag({name: 'twitter:image:src', content: tags.twitterImage});
            if (tags.twitterSite)
                this.meta.updateTag({name: 'twitter:site', content: tags.twitterSite});
            if (tags.twitterCreator)
                this.meta.updateTag({name: 'twitter:creator', content: tags.twitterCreator});
        }

        if (tags.ogType) {
            this.meta.updateTag({property: 'og:type', content: tags.ogType});
            this.meta.updateTag({property: 'og:title', content: tags.ogTitle});
            this.meta.updateTag({property: 'og:description', content: tags.ogDescription});
            this.meta.updateTag({property: 'og:url', content: `${protocol}//${host}${tags.slug}`});
            this.meta.updateTag({property: 'og:locale', content: tags.cultureCode});
            if (tags.ogSiteName)
                this.meta.updateTag({property: 'og:site_name', content: tags.ogSiteName});
            if (tags.ogImage)
                this.meta.updateTag({property: 'og:image', content: tags.ogImage});
        }
        if (tags.articleAuthorURL)
            this.meta.updateTag({property: 'article:author', content: tags.articleAuthorURL});
        if (tags.articlePublisherURL)
            this.meta.updateTag({property: 'article:publisher', content: tags.articlePublisherURL});

        if (tags.robots)
            this.meta.updateTag({name: 'robots', content: tags.robots});
        if (tags.author)
            this.meta.updateTag({name: 'author', content: tags.author});
        if (tags.owner)
            this.meta.updateTag({name: 'owner', content: tags.owner});
        if (tags.copyright)
            this.meta.updateTag({name: 'copyright', content: tags.copyright});

        this.meta.updateTag({name: 'apple-mobile-web-app-title', content: tags.title});
        this.meta.updateTag({httpEquiv: 'Content-Language', content: tags.languageCode});
        if (tags.facebookAppID)
            this.meta.updateTag({property: 'fb:app_id', content: tags.facebookAppID});
        if (tags.facebookAdmins)
            this.meta.updateTag({property: 'fb:admins', content: tags.facebookAdmins});
        if (tags.googlePublisher)
            this.updateLink({rel: 'publisher', href: tags.googlePublisher});

        this.updateLink({
            rel: 'alternate',
            href: `${protocol}//${host}${tags.slug}`,
            hreflang: 'x-default'});
        for (const langAlternate of tags.langAlternates) {
            if (tags.ogType) this.meta.updateTag({property: 'og:locale:alternate', content: langAlternate.cultureCode});
            this.updateLink({
                rel: 'alternate',
                href: `${protocol}//${host}${langAlternate.slug}`,
                hreflang: langAlternate.languageCode});
        }
    }

    /**
     * add or update link to head of document
     * @param linkObject: tags of link
     */
    updateLink(linkObject: LinkDefinition): void {
        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const link = renderer.createElement('link');

            const head = this.document.head;

            /* istanbul ignore if */
            if (head === null)
                return; // <head> not found within DOCUMENT

            Object.keys(linkObject)
                .forEach((prop: string) => {
                    return renderer.setAttribute(link, prop, linkObject[prop]);
                });

            /* istanbul ignore next */
            const attr: string = linkObject.rel ? 'rel' : 'hreflang';
            const attrSelector = `${attr}="${linkObject[attr]}"`;
            const linkTags = this.document.querySelectorAll(`link[${attrSelector}]`);
            for (const oldLink of linkTags)
                renderer.removeChild(head, oldLink);
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
}
