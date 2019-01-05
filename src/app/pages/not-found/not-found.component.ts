import { Component } from '@angular/core';
import { SeoService } from '../../services';

/**
 * Not Found Component
 */
@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
    /**
     * constructor of ArticleDetailComponent
     * @param seo: SeoService
     */
    constructor(
        private readonly seo: SeoService
    ) {
        this.seo.setHtmlTags({
            title: '404 - Page not found',
            description: '404 - Page not found',
            robots: 'noindex, nofollow'
        });
    }

}
