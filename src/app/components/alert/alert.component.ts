import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../services';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnDestroy, OnInit {
    message: any;
    private subscription: Subscription | undefined;

    constructor(private alertService: AlertService) { }

    ngOnInit(): void {
        this.subscription = this.alertService.getMessage()
            .subscribe(message => {
            this.message = message;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription !== undefined)
            this.subscription.unsubscribe();
    }
}
