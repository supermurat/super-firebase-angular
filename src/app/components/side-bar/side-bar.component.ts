import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';

/**
 * Side Bar Component
 */
@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit {
    /** do you want to hide search widget */
    hideSearchWidget = false;

    /**
     * constructor of SideBarComponent
     * @param router: Router
     */
    constructor(public router: Router) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.hideSearchWidget = this.router.url === '/search' || this.router.url.startsWith('/search?');
            });
        this.hideSearchWidget = this.router.url === '/search' || this.router.url.startsWith('/search?');
    }

}
