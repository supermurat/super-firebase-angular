declare let window: any;

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, LOCALE_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    renderer = '';
    title = 'app';

    private _isLoading = false;
    public get $isLoading() {
        return this._isLoading;
    }

    constructor(@Inject(PLATFORM_ID) private platformId: string,
                @Inject(DOCUMENT) doc: Document,
                @Inject(LOCALE_ID) locale: string,
                renderer: Renderer2) {
        renderer.setAttribute(doc.documentElement, 'lang', locale);
    }

    ngOnInit() {
        this.renderer = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';
    }

    ngOnDestroy() {

    }

    openAlert() {
        if (isPlatformBrowser(this.platformId)) {
            window.alert('Yes it is!');
        }
    }
}
