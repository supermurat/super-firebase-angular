import {SeoService} from '../../services';

declare let window: any;

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    renderer = '';
    title = 'app';

    constructor(@Inject(PLATFORM_ID) private platformId: string,
                private seo: SeoService) {}

    ngOnInit() {
        this.renderer = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';

        this.seo.generateTags({
            title: this.title,
            description: this.title
        });
    }

    openAlert() {
        if (isPlatformBrowser(this.platformId)) {
            window.alert('Yes it is!');
        }
    }
}
