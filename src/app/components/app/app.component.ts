import { AlertService, SeoService } from '../../services';

import { Component, Inject, LOCALE_ID, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'app';

    private _isLoading = false;
    get $isLoading(): boolean {
        return this._isLoading;
    }

    constructor(@Inject(PLATFORM_ID) private platformId: string,
                @Inject(DOCUMENT) doc: Document,
                @Inject(LOCALE_ID) locale: string,
                renderer: Renderer2,
                public seo: SeoService,
                public alert: AlertService) {
        renderer.setAttribute(doc.documentElement, 'lang', locale);
    }
}
