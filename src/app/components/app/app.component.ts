import { AlertService, SeoService } from '../../services';

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

    /** Is a component loading right now? */
    private _isLoading = false;

    /**
     * Is a component loading right now?
     */
    get $isLoading(): boolean {
        return this._isLoading;
    }

    /**
     * constructor of AppComponent
     * @param platformId: PLATFORM_ID
     * @param doc: DOCUMENT
     * @param locale: LOCALE_ID
     * @param renderer: Renderer2
     * @param seo: SeoService
     * @param alert: AlertService
     */
    constructor(@Inject(PLATFORM_ID) private platformId: string,
                @Inject(DOCUMENT) doc: Document,
                @Inject(LOCALE_ID) locale: string,
                renderer: Renderer2,
                public seo: SeoService,
                public alert: AlertService) {
        renderer.setAttribute(doc.documentElement, 'lang', locale.substr(0, 2));
    }
}
