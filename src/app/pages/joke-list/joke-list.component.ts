import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JokeModel, PagerModel } from '../../models';
import { PagerService, SeoService } from '../../services';

/**
 * Joke List Component
 */
@Component({
    selector: 'app-joke-list',
    templateUrl: './joke-list.component.html',
    styleUrls: ['./joke-list.component.scss']
})
export class JokeListComponent implements OnInit {
    /** joke object array */
    jokes$: Observable<Array<JokeModel>>;
    /** current page`s title */
    title = 'My Jokes';
    /** current page`s description */
    description = 'List of My Jokes';

    /** pager model */
    pagerModel: PagerModel = {
        pagePath: '/jokes',
        pageSize: 3
    };

    /** first joke */
    firstItem: JokeModel;
    /** order no of first joke, also it means (count of items * -1) */
    firstItemOrderNo: number;

    /** last item of current page */
    lastItemOfCurrentPage: JokeModel;
    /** last item order no of current page */
    lastItemOrderNoOfCurrentPage: number;

    /**
     * constructor of JokeListComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param pagerService: PagerService
     * @param locale: LOCALE_ID
     */
    constructor(private readonly afs: AngularFirestore,
                private readonly seo: SeoService,
                public router: Router,
                private readonly route: ActivatedRoute,
                private readonly pagerService: PagerService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            this.pagerModel.currentPageNo = Number(pmap.get('pageNo'));
            this.initJokes();
        });

        this.seo.setHtmlTags({
            title: this.title,
            description: this.description
        });
    }

    /**
     * init jokes and get first item
     */
    initJokes(): void {
        if (this.firstItem) { // no need to get firstItem again
            this.getJokes();
        } else {
            this.afs.collection(`jokes_${this.locale}`,
                ref => ref.orderBy('orderNo')
                    .limit(1)
            )
                .valueChanges()
                .subscribe(jokes => {
                    if (jokes.length > 0) {
                        this.firstItem = jokes[0];
                        this.firstItemOrderNo = this.firstItem.orderNo;
                        this.getJokes();
                    }
                });
        }
    }

    /**
     * check page no properties
     */
    checkPageNo(): void {
        this.pagerModel.maxPageNo = Math.ceil((this.firstItemOrderNo * -1) / this.pagerModel.pageSize);
        this.pagerService.initPager(this.pagerModel);
    }

    /**
     * get jokes
     */
    getJokes(): void {
        this.checkPageNo();
        const startAtOrderNo = this.firstItemOrderNo + ((this.pagerModel.currentPageNo - 1) * this.pagerModel.pageSize);
        this.jokes$ = this.afs.collection(`jokes_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .startAt(startAtOrderNo)
                .limit(this.pagerModel.pageSize)
        )
            .snapshotChanges()
            .pipe(map(actions =>
                actions.map(action => {
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data() as JokeModel;
                    if (!data.hasOwnProperty('contentSummary')) {
                        data.contentSummary = data.content;
                    }

                    return { id, ...data };
                })));
        this.jokes$.subscribe(jokes => {
            if (jokes.length > 0) {
                this.lastItemOfCurrentPage = jokes[jokes.length - 1];
                this.lastItemOrderNoOfCurrentPage = this.lastItemOfCurrentPage.orderNo;
            }
        });
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
