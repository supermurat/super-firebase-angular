import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/internal/operators';
import { languageNames } from '../../app-config';
import { ConfigModel, LanguageModel, PageBaseModel } from '../../models';
import { ConfigService, PageService } from '../../services';

/**
 * Nav Menu Component
 */
@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent implements OnInit {
    // tslint:disable:member-ordering
    /** array of languages */
    private readonly languages = new Subject<Array<LanguageModel>>();
    /** observable languages */
    languages$ = this.languages.asObservable();
    /** main menu items */
    mainMenuItems = [];

    /**
     * constructor of NavMenuComponent
     * @param platformId: PLATFORM_ID
     * @param locale: LOCALE_ID
     * @param router: Router
     * @param pageService: PageService
     * @param configService: ConfigService
     */
    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: string,
        @Inject(LOCALE_ID) public locale: string,
        public router: Router,
        public pageService: PageService,
        public configService: ConfigService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.configService.getConfig()
            .subscribe((config: ConfigModel) => {
                this.mainMenuItems = config.mainMenuItems;
            });
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (isPlatformBrowser(this.platformId)) {
                    const scrollToTop = window.setInterval(() => {
                        const pos = window.pageYOffset;
                        if (pos > 0) {
                            window.scrollTo(0, pos - 60); // how far to scroll on each step
                        } else {
                            window.clearInterval(scrollToTop);
                        }
                    }, 16);
                }
            });

        this.pageService.getPage()
            .subscribe((page: PageBaseModel) => {
                const existLanguages = [];
                const languageList: Array<LanguageModel> = [];
                const languageCode = this.locale.substring(0, 2);
                languageList.push({
                    languageCode,
                    languageName: languageNames[languageCode],
                    url: `/${languageCode}${this.router.url}`,
                    isExist: true
                });
                existLanguages.push(languageCode);
                if (page.locales) {
                    for (const locale of page.locales) {
                        languageList.push({
                            languageCode: locale.cultureCode.substring(0, 2),
                            languageName: languageNames[locale.cultureCode.substring(0, 2)],
                            url: `/${locale.slug}`,
                            isExist: true
                        });
                        existLanguages.push(locale.cultureCode.substring(0, 2));
                    }
                }
                Object.keys(languageNames)
                    .forEach(langCode => {
                        if (existLanguages.indexOf(langCode) === -1) {
                            languageList.push({
                                languageCode: langCode,
                                languageName: languageNames[langCode],
                                url: `/${langCode}/home`,
                                isExist: false
                            });
                        }
                });
                this.languages.next(languageList);
            });
    }
}
