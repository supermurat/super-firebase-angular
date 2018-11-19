import { Component } from '@angular/core';
import { SeoService } from '../../services';

/**
 * Not Found Component
 */
@Component({
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
    /**
     * constructor of PageDetailComponent
     * @param seo: SeoService
     */
    constructor(
        private seo: SeoService
    ) {
        this.seo.generateTags({
            title: '404 - Page not found',
            description: '404 - Page not found'
        });
    }

}
