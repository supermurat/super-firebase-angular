import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BlogModel } from '../../models';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { BlogDetailComponent } from './blog-detail.component';

describe('BlogDetailComponent', () => {
    let fixture: ComponentFixture<BlogDetailComponent>;
    let comp: BlogDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: 'blog/:id', component: BlogDetailComponent},
                    {path: 'blogs', component: BlogDetailComponent},
                    {path: 'blogs/:pageNo', component: BlogDetailComponent},
                    {path: 'en/blog/:id', component: BlogDetailComponent},
                    {path: 'tr/gunluk/:id', component: BlogDetailComponent},
                    {path: 'en/blog', component: BlogDetailComponent},
                    {path: 'tr/gunluk', component: BlogDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
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

    it('should load second-blog', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'second-blog'});
        fixture.detectChanges();
        let lastBlog = new BlogModel();
        comp.blog$.subscribe(blog => {
            lastBlog = blog;
        });
        tick();
        expect(lastBlog.id)
            .toEqual('second-blog');
    }));

    it("should redirect to '/blog/first-blog' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/blog/first-blog');
    }));

    it("should redirect to '/blog/third-blog' if id is -4", fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'blogs', 'blog');
        activatedRouteStub.setParamMap({id: '-4'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/blog/third-blog');
    }));

    it('should redirect to translation of ilk-gunluk', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'blogs', 'blog');
        activatedRouteStub.navigate(fixture, comp.router, ['/blog', 'ilk-gunluk']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/en/blog/first-blog');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'blogs', 'blog');
        activatedRouteStub.navigate(fixture, comp.router, ['/blog', 'not-found-page']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/blog/not-found-page/http-404');
    }));

    it('should redirect to translation of sadece-turkce-gunluk', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'blogs', 'blog');
        activatedRouteStub.navigate(fixture, comp.router, ['/blog', 'sadece-turkce-gunluk']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/gunluk/sadece-turkce-gunluk');
    }));

});

describe('BlogDetailComponent_tr-TR', () => {
    let fixture: ComponentFixture<BlogDetailComponent>;
    let comp: BlogDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent
            ],
            providers: [
                {provide: LOCALE_ID, useValue: 'tr-TR'}
            ],
            imports: [
                TestHelperModule,
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
                    {path: 'tr/gunluk', component: BlogDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
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

    it('should redirect to translation of first-blog', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'gunlukler', 'gunluk');
        activatedRouteStub.navigate(fixture, comp.router, ['/gunluk', 'first-blog']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/gunluk/ilk-gunluk');
    }));

});
