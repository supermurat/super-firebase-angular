import { AlertService, SeoService } from '../../services';

/** window object of browser */
declare let window: any;

import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Playground Component
 */
@Component({
    selector: 'app-playground',
    templateUrl: './playground.component.html',
    styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
    /** what is rendering this page? Browser or Server */
    rendererText = '';
    /** current page`s title */
    title = 'Play Ground';
    /** Date object of today */
    today: number = Date.now();
    /** current minutes */
    minutes = 0;
    /** current gender */
    gender = 'female';

    /**
     * increase current minutes by i
     *
     * result can't be more than 5 and less than 0
     * @param i: how many you want to increase
     */
    inc(i: number): void {
        this.minutes = Math.min(5, Math.max(0, this.minutes + i));
    }
    /**
     * set male as current gender
     */
    male(): void { this.gender = 'male'; }
    /**
     * set female as current gender
     */
    female(): void { this.gender = 'female'; }
    /**
     * set other as current gender
     */
    other(): void { this.gender = 'other'; }

    /**
     * constructor of PlaygroundComponent
     * @param platformId: PLATFORM_ID
     * @param locale: LOCALE_ID
     * @param seo: SeoService
     * @param alert: AlertService
     */
    constructor(@Inject(PLATFORM_ID) private platformId: string,
                @Inject(LOCALE_ID) public locale: string,
                private seo: SeoService,
                public alert: AlertService) {}

    /**
     * ngOnDestroy
     */
    ngOnInit(): void {
        this.rendererText = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';

        this.seo.generateTags({
            title: this.title,
            description: this.title
        });
    }

    /**
     * show alert panel and dialog
     */
    openAlert(): void {
        this.alert.success('This is alert test');
        if (isPlatformBrowser(this.platformId))
            window.alert('Yes it is!');
    }
}
