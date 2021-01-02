import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';
import { AlertService, PageService } from '../../services';

/**
 * Search Component
 */
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    /** safe html of google custom search API box */
    gcseSearchBox: SafeHtml;
    /** safe html of google custom search API result */
    gcseSearchResult: SafeHtml;

    /**
     * constructor of SearchComponent
     * @param platformId: PLATFORM_ID
     * @param pageService: PageService
     * @param alert: AlertService
     * @param sanitizer: DomSanitizer
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public pageService: PageService,
                public alert: AlertService,
                private readonly sanitizer: DomSanitizer) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.pageService.initPage({
            title: 'Search Result',
            description: 'Search Result'
            // seo: {names: {robots: 'noindex, nofollow'}}
        });

        this.gcseSearchBox = this.sanitizer.bypassSecurityTrustHtml(
            '<gcse:searchbox-only resultsUrl="/search"></gcse:searchbox-only>'
        );
        this.gcseSearchResult = this.sanitizer.bypassSecurityTrustHtml('<gcse:searchresults-only></gcse:searchresults-only>');

        if (isPlatformBrowser(this.platformId) && environment.cse.cx) {
            const gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = `https://cse.google.com/cse.js?cx=${environment.cse.cx}`;
            const s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);
        }
    }

}
