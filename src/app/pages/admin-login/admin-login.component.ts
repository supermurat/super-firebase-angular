import { Component, OnInit } from '@angular/core';
import { AuthService, PageService } from '../../services';

/**
 * Admin Login Component
 */
@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent implements OnInit {

    /**
     * constructor of AdminLoginComponent
     * @param pageService: PageService
     * @param auth: AuthService
     */
    constructor(
        public pageService: PageService,
        public auth: AuthService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.pageService.initPage({
            title: 'Admin Login',
            description: 'Admin login page'
        });
    }

}
