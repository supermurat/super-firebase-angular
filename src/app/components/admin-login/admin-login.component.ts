import { Component, OnInit } from '@angular/core';
import { AlertService, AuthService, SeoService } from '../../services';

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
     * @param seo: SeoService
     * @param auth: AuthService
     */
    constructor(
        public seo: SeoService,
        public auth: AuthService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.seo.generateTags({
            title: 'Admin Login',
            description: 'Admin login page'
        });
    }

}
