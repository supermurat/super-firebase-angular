import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';
import { ConfigModel, CustomHtmlModel } from '../../models';
import { ConfigService, PageService } from '../../services';

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
    /** primary custom html widget */
    customHtml: CustomHtmlModel;

    /**
     * constructor of SideBarComponent
     * @param router: Router
     * @param configService: ConfigService
     */
    constructor(public router: Router,
                public configService: ConfigService) {
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

        this.configService.getConfig()
            .subscribe((config: ConfigModel) => {
                this.customHtml = config.primaryCustomHtmlWidget;
            });
    }

}
