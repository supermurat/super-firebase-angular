declare let window: any;

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

    constructor(@Inject(PLATFORM_ID) private platformId: string) {}

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
