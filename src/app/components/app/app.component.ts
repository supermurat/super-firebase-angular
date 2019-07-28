import { DOCUMENT } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';
import { Observable } from 'rxjs';
import { ConfigModel, HttpStatusModel } from '../../models';
import { AlertService, ConfigService, JsonLDService, PageService, PaginationService, SeoService } from '../../services';

/**
 * App Component
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    /** http status */
    httpStatus$: Observable<HttpStatusModel>;
    /** json-LD */
    jsonLD$: Observable<SafeHtml>;

    /** cookieLaw element */
    @ViewChild('cookieLaw', { static: false }) cookieLawEl: any;

    /** scroll handler */
    private scrollHandler: any;

    /**
     * constructor of AppComponent
     * @param platformId: PLATFORM_ID
     * @param doc: DOCUMENT
     * @param locale: LOCALE_ID
     * @param renderer: Renderer2
     * @param router: Router
     * @param seo: SeoService
     * @param jsonLDService: JsonLDService
     * @param alert: AlertService
     * @param pagination: PaginationService
     * @param configService: ConfigService
     * @param pageService: PageService
     * @param angulartics2GoogleGlobalSiteTag: Angulartics2GoogleGlobalSiteTag
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                @Inject(DOCUMENT) doc: Document,
                @Inject(LOCALE_ID) readonly locale: string,
                private readonly renderer: Renderer2,
                public router: Router,
                public seo: SeoService,
                public jsonLDService: JsonLDService,
                public alert: AlertService,
                public pagination: PaginationService,
                public configService: ConfigService,
                public pageService: PageService,
                angulartics2GoogleGlobalSiteTag: Angulartics2GoogleGlobalSiteTag) {
        angulartics2GoogleGlobalSiteTag.startTracking();
        seo.renderer = renderer;
        renderer.setAttribute(doc.documentElement, 'lang', locale.substr(0, 2));
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.pageService.getDocumentFromFirestore(ConfigModel, `configs/public_${this.locale}`)
            .subscribe(config => {
                if (!config.configSEO) {
                    config.configSEO = {};
                }
                this.configService.init(config);
                this.seo.configSEO = config.configSEO;
            });
        this.httpStatus$ = this.seo.getHttpStatus();
        this.jsonLD$ = this.jsonLDService.getJsonLD();

        this.scrollHandler = this.renderer.listen('window', 'scroll', event => {
            // istanbul ignore next
            if (this.cookieLawEl && !this.cookieLawEl.seen) {
                this.cookieLawEl.dismiss();
                this.scrollHandler();
            }
        });
    }
}
