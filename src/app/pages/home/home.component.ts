import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AlertService, CarouselService, SeoService } from '../../services';

/**
 * Home Component
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    /** current page`s title */
    title = 'home';

    /**
     * constructor of HomeComponent
     * @param platformId: PLATFORM_ID
     * @param seo: SeoService
     * @param alert: AlertService
     * @param carouselService: CarouselService
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public seo: SeoService,
                public alert: AlertService,
                public carouselService: CarouselService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.seo.setHtmlTags({
            title: this.title,
            description: this.title
        });
        this.carouselService.init({
            // tslint:disable:max-line-length
            carouselItems: [
                {
                    src: 'https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com/o/publicFiles%2Fcarousels%2Fcarousel-1.jpg?alt=media&token=5a18eb58-5278-4f33-8968-142ad8c11fd0',
                    title: 'Welcome to endless world!'
                },
                {
                    src: 'https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com/o/publicFiles%2Fcarousels%2Fcarousel-2.jpg?alt=media&token=648dfdad-1bba-4ff0-a36a-0af5d6cb99a3',
                    title: 'Isn\'t it beautiful?'
                },
                {
                    src: 'https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com/o/publicFiles%2Fcarousels%2Fcarousel-3.jpg?alt=media&token=58e0292e-d1c5-4216-b17b-cf276d338124',
                    title: 'Hey, what\'s up?'
                }]
        });
    }

}
