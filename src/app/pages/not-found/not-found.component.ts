import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageService, SeoService } from '../../services';

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
     * @param router: Router
     * @param seo: SeoService
     */
    constructor(
        private readonly pageService: PageService,
        private readonly router: Router,
        private readonly seo: SeoService
    ) {
        this.pageService.initPage({
            title: '404 - Page not found',
            description: '404 - Page not found'
            // seo: {names: {robots: 'noindex, nofollow'}}
        });
        if (!this.router.url.endsWith('/http-404')) {
            this.seo.http404();
        }
    }

}
