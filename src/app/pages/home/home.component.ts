import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PageBaseModel, PageModel } from '../../models';
import { AlertService, CarouselService, PaginationService, SeoService } from '../../services';

/**
 * Home Component
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** contents of current page */
    contents$: Observable<Array<PageBaseModel>>;

    /**
     * constructor of HomeComponent
     * @param platformId: PLATFORM_ID
     * @param seo: SeoService
     * @param alert: AlertService
     * @param carouselService: CarouselService
     * @param afs: AngularFirestore
     * @param locale: LOCALE_ID
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public seo: SeoService,
                public alert: AlertService,
                public carouselService: CarouselService,
                private readonly afs: AngularFirestore,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.page$ = this.afs.doc<PageModel>(`pages_${this.locale}/home`)
            .valueChanges();
        this.page$.subscribe(page => {
            if (page) {
                this.seo.setHtmlTags(page);
                this.carouselService.init(page.carousel);
            }
        });
        this.contents$ = this.afs.collection(`pages_${this.locale}/home/contents`,
            ref => ref.orderBy('orderNo'))
            .valueChanges();
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
