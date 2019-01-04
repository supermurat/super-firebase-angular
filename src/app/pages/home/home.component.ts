import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PageBaseModel, PageModel } from '../../models';
import { AlertService, CarouselService, PageService, SeoService } from '../../services';

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
     * @param pageService: PageService
     * @param locale: LOCALE_ID
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public seo: SeoService,
                public alert: AlertService,
                public carouselService: CarouselService,
                private readonly afs: AngularFirestore,
                public pageService: PageService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.page$ = this.pageService.getPageFromFirestore('home');
        this.contents$ = this.afs.collection(`pages_${this.locale}/home/contents`,
            ref => ref.orderBy('orderNo')
                .limit(3))
            .valueChanges();
    }

}
