import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService, PagerService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub, angularFirestoreStubNoData } from '../../testing/index.spec';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { PagerComponent } from '../pager/pager.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { BlogListComponent } from './blog-list.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('BlogListComponent', () => {
    let fixture: ComponentFixture<BlogListComponent>;
    let comp: BlogListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, PagerService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'blogs', redirectTo: 'blogs/1', pathMatch: 'full'},
                    {path: 'blogs/:pageNo', component: BlogListComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(BlogListComponent);
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

    it("should have as title 'Murat Demir's blog'", async(() => {
        expect(comp.title)
            .toEqual('Murat Demir\'s blog');
    }));

    it('count of blog should be 3', async(() => {
        activatedRouteStub.setParamMap({pageNo: 1});
        comp.blogs$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

    it('should redirect to page 1 if page is not exist', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 9}); // page 9 not exist
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/blogs/1');
        fixture.detectChanges();
    }));

});

describe('BlogListComponentNoData', () => {
    let fixture: ComponentFixture<BlogListComponent>;
    let comp: BlogListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, PagerService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStubNoData},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'blogs', redirectTo: 'blogs/1', pathMatch: 'full'},
                    {path: 'blogs/:pageNo', component: BlogListComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(BlogListComponent);
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

});
