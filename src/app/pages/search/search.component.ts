import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService, SeoService } from '../../services';

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
     * @param seo: SeoService
     * @param alert: AlertService
     * @param sanitizer: DomSanitizer
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public seo: SeoService,
                public alert: AlertService,
                private readonly sanitizer: DomSanitizer) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.seo.setHtmlTags({
            title: 'Search Result',
            description: 'Search Result',
            seo: {custom: {robots: 'noindex, nofollow'}}
        });

        this.gcseSearchBox = this.sanitizer.bypassSecurityTrustHtml(
            '<gcse:searchbox-only resultsUrl="/search"></gcse:searchbox-only>'
        );
        this.gcseSearchResult = this.sanitizer.bypassSecurityTrustHtml('<gcse:searchresults-only></gcse:searchresults-only>');

        const cx = '009513577206836808676:joyznri9mmm';
        const gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = `https://cse.google.com/cse.js?cx=${cx}`;
        const s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    }

}
