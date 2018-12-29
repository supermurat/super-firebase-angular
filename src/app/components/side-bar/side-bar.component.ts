import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';
import { AlertService } from '../../services';

/**
 * Side Bar Component
 */
@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
    /** search for */
    searchFor = '';
    /** do you want to hide search widget */
    hideSearchWidget = false;
    /**
     * constructor of SideBarComponent
     * @param router: Router
     * @param alert: AlertService
     */
    constructor(private readonly router: Router,
                private readonly alert: AlertService) {
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
    }

    /**
     * on click search button
     */
    onClickSearch(): void {
        this.router.navigate(['/search'], { queryParams: { q: this.searchFor}})
            .catch(// istanbul ignore next
                reason => {
                    this.alert.error(reason);
                });
    }
}
