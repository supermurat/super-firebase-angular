import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { ConfigSeoModel, PageBaseModel } from '../models';

/**
 * JsonLD Service
 */
@Injectable()
export class JsonLDService {

    /** json-LD */
    private readonly jsonLD$ = new Subject<SafeHtml>();

    /**
     * constructor of JsonLDService
     * @param sanitizer: DomSanitizer
     */
    constructor(private readonly sanitizer: DomSanitizer) {
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
     * @param configSEO: current config for seo
     */
    getJsonLDByContentOfCurrentPage(tempPage: any, configSEO: ConfigSeoModel): Array<any> {
        const jsonLDs = [];
        const images = [];
        const image = tempPage.image ? tempPage.image :
            configSEO.defaultImageForSEO ? configSEO.defaultImageForSEO : undefined;
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
        const publisher = configSEO.defaultPublisher ? configSEO.defaultPublisher : undefined;
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
     * @param configSEO: current config for seo
     */
    setJsonLD(tempPage: PageBaseModel, configSEO: ConfigSeoModel): void {
        if (tempPage.hasOwnProperty('jsonLDs')) {
            tempPage.jsonLDs.push(...this.getJsonLDByContentOfCurrentPage(tempPage, configSEO));
        } else {
            tempPage.jsonLDs = this.getJsonLDByContentOfCurrentPage(tempPage, configSEO);
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
     * get json-LD
     */
    getJsonLD(): Observable<SafeHtml> {
        return this.jsonLD$.asObservable();
    }
}
