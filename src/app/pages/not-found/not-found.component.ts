import { Component } from '@angular/core';
import { PageService } from '../../services';

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
     * @param pageService: PageService
     */
    constructor(
        private readonly pageService: PageService
    ) {
        this.pageService.initPage({
            title: '404 - Page not found',
            description: '404 - Page not found',
            seo: {names: {robots: 'noindex, nofollow'}}
        });
    }

}
