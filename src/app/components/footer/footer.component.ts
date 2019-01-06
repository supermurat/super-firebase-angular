import { Component } from '@angular/core';
import { PageService } from '../../services';

/**
 * Footer Component
 */
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {

    /**
     * constructor of FooterComponent
     * @param pageService: PageService
     */
    constructor(public pageService: PageService) {
    }
}
