import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { CarouselModel } from '../models';

/**
 * Carousel Service
 */
@Injectable()
export class CarouselService {
    /** collection of carousel */
    private readonly subject = new Subject<any>();

    /**
     * constructor of CarouselService
     * @param router: Router
     */
    constructor(router: Router) {
        // clear carousel on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.subject.next();
            }
        });
    }

    /**
     * init carousel
     * @param carouselModel: CarouselModel
     */
    init(carouselModel: CarouselModel): void {
        if (carouselModel) {
            this.subject.next(carouselModel);
        }
    }

    /**
     * get current carousel
     */
    getCarousel(): Observable<any> {
        return this.subject.asObservable();
    }
}
