import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ContactModel, PageModel } from '../../models';
import { AlertService, PageService } from '../../services';

/**
 * Contact Component
 */
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** current contact data */
    contact: ContactModel = {};
    /** is show privacy policy? */
    isShowPrivacyPolicy = false;
    /** is show thank you note? */
    isShowThankYou = false;

    /**
     * constructor of ContactComponent
     * @param platformId: PLATFORM_ID
     * @param pageService: PageService
     * @param afs: AngularFirestore
     * @param alert: AlertService
     * @param locale: LOCALE_ID
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public pageService: PageService,
                private readonly afs: AngularFirestore,
                public alert: AlertService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.isShowPrivacyPolicy = false;
        this.isShowThankYou = false;
        this.page$ = this.pageService.getPageFromFirestore(PageModel, 'pages', this.pageService.getRoutePathName());
    }

    /**
     * on click send button
     */
    onClickSend(): void {
        this.afs.collection(`messages_${this.locale}`)
            .add(this.contact)
            .then(value => {
                this.isShowThankYou = true;
                this.contact = {};
            })
            .catch(reason => {
                this.alert.error(reason);
            });
    }
}
