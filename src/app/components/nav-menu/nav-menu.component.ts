import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';
import { locales } from '../../locales.values';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent implements OnInit {
    locales = [];
    currentUrl = '';

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        private router: Router) {
    }

    ngOnInit(): void {
        this.locales = locales;

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.currentUrl = this.router.url;
            });
    }

    trackByLocale(index, item): number {
        return index;
    }
}
