import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services';

/**
 * Search Bar Component
 */
@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
    /** css class of header */
    @Input() readonly headerCssClass = '';
    /** search for */
    searchFor = '';

    /**
     * constructor of SearchBarComponent
     * @param router: Router
     * @param alert: AlertService
     */
    constructor(public router: Router,
                private readonly alert: AlertService) {
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
