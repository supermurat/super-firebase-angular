import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/internal/operators';
import { locales } from '../../locales.values';
import './nav-menu.component.scss';

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

    ngOnInit() {
        this.locales = locales;

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.currentUrl = this.router.url;
            });
    }
}
