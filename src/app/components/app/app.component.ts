import { AlertService, SeoService } from '../../services';

declare let window: any;

import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    renderer = '';
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

    ngOnInit(): void {
        this.renderer = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';
    }

    openAlert(): void {
        if (isPlatformBrowser(this.platformId))
            window.alert('Yes it is!');
    }
}
