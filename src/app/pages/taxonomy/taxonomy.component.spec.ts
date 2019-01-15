import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { ScrollableDirective } from '../../directives';
import { TaxonomyModel } from '../../models';
import { AlertService, CarouselService, ConfigService, PageService, PaginationService, SeoService } from '../../services';
import { ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { ActiveTagsComponent } from '../../widgets/active-tags/active-tags.component';
import { CustomHtmlComponent } from '../../widgets/custom-html/custom-html.component';
import { LastJokesComponent } from '../../widgets/last-jokes/last-jokes.component';
import { SearchBarComponent } from '../../widgets/search-bar/search-bar.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { TaxonomyComponent } from './taxonomy.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('TaxonomyComponent', () => {
    let fixture: ComponentFixture<TaxonomyComponent>;
    let comp: TaxonomyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaxonomyComponent,
                SideBarComponent,
                ScrollableDirective,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent,
                NotFoundComponent,
                CustomHtmlComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: TaxonomyComponent},
                    {path: 'tag/:id', component: TaxonomyComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TaxonomyComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should load first-tag', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-tag'});
        fixture.detectChanges();
        let lastTag = new TaxonomyModel();
        comp.tag$.subscribe(tag => {
            lastTag = tag;
        });
        tick();
        expect(lastTag.id)
            .toEqual('first-tag');
    }));

    it('scrollHandler("bottom") should load more data', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-tag'});
        tick();
        fixture.detectChanges();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.scrollHandler('bottom');
        tick();
        expect(countOfItem)
            .toEqual(8);
    }));

    it('scrollHandler("top") should not load more data', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-tag'});
        tick();
        fixture.detectChanges();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        tick();
        comp.scrollHandler('top');
        tick();
        expect(countOfItem)
            .toEqual(5);
    }));

});
