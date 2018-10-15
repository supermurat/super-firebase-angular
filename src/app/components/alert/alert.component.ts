import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../services';

/**
 * Alert Component
 */
@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnDestroy, OnInit {
    /** message object */
    message: any;
    /** subscription */
    subscription: Subscription | undefined;

    /**
     * constructor of AlertComponent
     * @param alertService: AlertService
     */
    constructor(public alertService: AlertService) { }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.subscription = this.alertService.getMessage()
            .subscribe(message => {
            this.message = message;
        });
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        if (this.subscription !== undefined)
            this.subscription.unsubscribe();
    }
}
