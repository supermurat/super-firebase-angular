import { AlertService, PaginationService, SeoService } from '../../services';

/** window object of browser */
declare let window: any;

import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

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
    /** async image URL */
    imgURL$: Observable<any>;
    /** image URL */
    imgURL: string;

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
     * @param page: PaginationService
     * @param storage: AngularFireStorage
     */
    constructor(@Inject(PLATFORM_ID) private platformId: string,
                @Inject(LOCALE_ID) public locale: string,
                private seo: SeoService,
                public alert: AlertService,
                public page: PaginationService,
                private storage: AngularFireStorage) {}

    /**
     * ngOnDestroy
     */
    ngOnInit(): void {
        this.page.init('blogs', 'created', { reverse: true, prepend: false });

        this.rendererText = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';

        this.seo.generateTags({
            title: this.title,
            description: this.title
        });

        const ref = this.storage.ref('blogs/bad, very bad angel.gif');
        this.imgURL$ = ref.getDownloadURL();
        this.imgURL$.subscribe(result => {
            this.imgURL = result;
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

    /**
     * scroll handler for pagination
     * @param e: event
     */
    scrollHandler(e): void {
        if (e === 'bottom')
            this.page.more();
        if (e === 'top')
            this.page.more();
    }

    /**
     * track blog object array by blog
     * @param index: blog index no
     * @param item: blog object
     */
    trackByBlog(index, item): number {
        return index;
    }
}
