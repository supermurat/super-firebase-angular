import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';
import { locales } from '../../app-config';
import { PageService } from '../../services';

/**
 * Nav Menu Component
 */
@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent implements OnInit {
    /** active locale object array */
    locales = [];
    /** current page`s url */
    currentUrl = '';

    /**
     * constructor of NavMenuComponent
     * @param locale: LOCALE_ID
     * @param router: Router
     * @param pageService: PageService
     */
    constructor(
        @Inject(LOCALE_ID) public locale: string,
        private readonly router: Router,
        public pageService: PageService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.locales = locales;

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.currentUrl = this.router.url;

                const scrollToTop = window.setInterval(() => {
                    const pos = window.pageYOffset;
                    if (pos > 0) {
                        window.scrollTo(0, pos - 60); // how far to scroll on each step
                    } else {
                        window.clearInterval(scrollToTop);
                    }
                }, 16);
            });
    }

    /**
     * track locale object array by locale
     * @param index: locale index
     * @param item: locale object
     */
    trackByLocale(index, item): number {
        return index;
    }
}
