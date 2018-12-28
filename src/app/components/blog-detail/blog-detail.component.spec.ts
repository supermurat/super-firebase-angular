import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { BlogModel } from '../../models';
import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { BlogDetailComponent } from './blog-detail.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('BlogDetailComponent', () => {
    let fixture: ComponentFixture<BlogDetailComponent>;
    let comp: BlogDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'blog/:id', component: BlogDetailComponent},
                    {path: 'blogs', component: BlogDetailComponent},
                    {path: 'blogs/:pageNo', component: BlogDetailComponent},
                    {path: 'en/blog/:id', component: BlogDetailComponent},
                    {path: 'tr/gunluk/:id', component: BlogDetailComponent},
                    {path: 'en/blog', component: BlogDetailComponent},
                    {path: 'tr/gunluk', component: BlogDetailComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(BlogDetailComponent);
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

    it('should load first-blog', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-blog'});
        fixture.detectChanges();
        let lastBlog = new BlogModel();
        comp.blog$.subscribe(blog => {
            lastBlog = blog;
        });
        tick();
        expect(lastBlog.id)
            .toEqual('first-blog');
    }));

    it("should redirection to '/blog/first-blog' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/blog/first-blog');
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

    it("should redirection to '/blog/third-blog' if id is -4", fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'blogs', 'blog');
        activatedRouteStub.setParamMap({id: '-4'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/blog/third-blog');
    }));

    it('should redirection to translation of ilk-gunluk', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'blogs', 'blog');
        activatedRouteStub.navigate(fixture, comp.router, ['/blog', 'ilk-gunluk']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/gunluk/ilk-gunluk');
    }));

});

describe('BlogDetailComponent_tr-TR', () => {
    let fixture: ComponentFixture<BlogDetailComponent>;
    let comp: BlogDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG},
                {provide: LOCALE_ID, useValue: 'tr-TR'}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'blog/:id', component: BlogDetailComponent},
                    {path: 'blogs', component: BlogDetailComponent},
                    {path: 'blogs/:pageNo', component: BlogDetailComponent},
                    {path: 'gunluk/:id', component: BlogDetailComponent},
                    {path: 'gunlukler', component: BlogDetailComponent},
                    {path: 'gunlukler/:pageNo', component: BlogDetailComponent},
                    {path: 'en/blog/:id', component: BlogDetailComponent},
                    {path: 'tr/gunluk/:id', component: BlogDetailComponent},
                    {path: 'en/blog', component: BlogDetailComponent},
                    {path: 'tr/gunluk', component: BlogDetailComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(BlogDetailComponent);
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

    it('should redirection to translation of first-blog', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'gunlukler', 'gunluk');
        activatedRouteStub.navigate(fixture, comp.router, ['/gunluk', 'first-blog']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/en/blog/first-blog');
    }));

});
