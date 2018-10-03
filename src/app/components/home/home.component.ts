import { SeoService } from '../../services';

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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

    ngOnInit(): void {
        this.renderer = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';

        this.seo.generateTags({
            title: this.title,
            description: this.title
        });
    }

}
