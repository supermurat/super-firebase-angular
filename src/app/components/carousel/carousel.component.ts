import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarouselModel } from '../../models';
import { CarouselService } from '../../services';

/**
 * Carousel Component
 */
@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html'
})
export class CarouselComponent implements OnDestroy, OnInit {
    /** carousel object */
    carouselModel: CarouselModel;
    /** subscription */
    subscription: Subscription | undefined;

    /**
     * constructor of CarouselComponent
     * @param carouselService: CarouselService
     */
    constructor(public carouselService: CarouselService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.subscription = this.carouselService.getCarousel()
            .subscribe(carouselModel => {
                this.carouselModel = carouselModel;
            });
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * track content object array by index
     * @param index: index no
     * @param item: object
     */
    trackByIndex(index, item): number {
        return index;
    }

}
