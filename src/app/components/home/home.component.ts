import { AlertService, SeoService } from '../../services';

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    title = 'home';

    constructor(@Inject(PLATFORM_ID) private platformId: string,
                public seo: SeoService, public alert: AlertService) {}

    ngOnInit(): void {
        this.seo.generateTags({
            title: this.title,
            description: this.title
        });
    }

}
