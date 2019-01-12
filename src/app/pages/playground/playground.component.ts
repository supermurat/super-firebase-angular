/** window object of browser */
declare let window: any;

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AlertService, PageService, PaginationService } from '../../services';

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
    male(): void {
        this.gender = 'male';
    }

    /**
     * set female as current gender
     */
    female(): void {
        this.gender = 'female';
    }

    /**
     * set other as current gender
     */
    other(): void {
        this.gender = 'other';
    }

    /**
     * constructor of PlaygroundComponent
     * @param platformId: PLATFORM_ID
     * @param locale: LOCALE_ID
     * @param pageService: PageService
     * @param alert: AlertService
     * @param pagination: PaginationService
     * @param storage: AngularFireStorage
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                @Inject(LOCALE_ID) public locale: string,
                private readonly pageService: PageService,
                public alert: AlertService,
                public pagination: PaginationService,
                private readonly storage: AngularFireStorage) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.pagination.init(`blogs_${this.locale}`, 'created', {reverse: true, prepend: false});

        this.rendererText = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';

        this.pageService.initPage({
            title: this.title,
            description: this.title
        });

        const ref = this.storage.ref('publicFiles/bad, very bad angel.gif');
        if (isPlatformBrowser(this.platformId)) {
            // following lines are not working on server side because of undefined XMLHttpRequest
            this.imgURL$ = ref.getDownloadURL();
            this.imgURL$.subscribe(result => {
                this.imgURL = result;
            });
        }
    }

    /**
     * show alert panel and dialog
     */
    openAlert(): void {
        this.alert.success('This is alert test');
        if (isPlatformBrowser(this.platformId)) {
            window.alert('Yes it is!');
        }
    }

    /**
     * scroll handler for pagination
     * @param e: event
     */
    scrollHandler(e): void {
        if (e === 'bottom') {
            this.pagination.more();
        }
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
