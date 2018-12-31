import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AlertService, SeoService } from '../../services';

/**
 * Home Component
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    /** current page`s title */
    title = 'home';

    /**
     * constructor of HomeComponent
     * @param platformId: PLATFORM_ID
     * @param seo: SeoService
     * @param alert: AlertService
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public seo: SeoService,
                public alert: AlertService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.seo.setHtmlTags({
            title: this.title,
            description: this.title
        });
    }

}