import { AlertService, PaginationService, SeoService } from '../../services';

import { Component, Inject, LOCALE_ID, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * App Component
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    /**
     * constructor of AppComponent
     * @param platformId: PLATFORM_ID
     * @param doc: DOCUMENT
     * @param locale: LOCALE_ID
     * @param renderer: Renderer2
     * @param seo: SeoService
     * @param alert: AlertService
     * @param page: PaginationService
     */
    constructor(@Inject(PLATFORM_ID) private platformId: string,
                @Inject(DOCUMENT) doc: Document,
                @Inject(LOCALE_ID) locale: string,
                renderer: Renderer2,
                public seo: SeoService,
                public alert: AlertService,
                public page: PaginationService) {
        renderer.setAttribute(doc.documentElement, 'lang', locale.substr(0, 2));
    }
}
