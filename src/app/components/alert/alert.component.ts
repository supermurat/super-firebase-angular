import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../services';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {
            this.message = message;
        });
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}