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
        let lastBlog = new BlogModel();
        comp.pageService.getPage()
            .subscribe(blog => {
                lastBlog = blog;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'blogs', 'blog',
            ['/blog', 'first-blog']);
        expect(lastBlog.id)
            .toEqual('first-blog');
    }));

    it('should load second-blog', fakeAsync(() => {
        let lastBlog = new BlogModel();
        comp.pageService.getPage()
            .subscribe(blog => {
                lastBlog = blog;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'blogs', 'blog',
            ['/blog', 'second-blog']);
        expect(lastBlog.id)
            .toEqual('second-blog');
    }));

    it("should redirect to '/blog/first-blog' if id is -1", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'blogs', 'blog',
            ['/blog', '-1']);
        expect(comp.router.url)
            .toEqual('/blog/first-blog');
    }));

    it("should redirect to '/blog/third-blog' if id is -4", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'blogs', 'blog',
            ['/blog', '-4']);
        expect(comp.router.url)
            .toEqual('/blog/third-blog');
    }));

    it('should redirect to translation of ilk-gunluk', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'blogs', 'blog',
            ['/blog', 'ilk-gunluk']);
        expect(comp.router.url)
            .toEqual('/en/blog/first-blog');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'blogs', 'blog',
            ['/blog', 'not-found-page']);
        expect(comp.router.url)
            .toEqual('/blog/not-found-page/http-404');
    }));

    it('should redirect to translation of sadece-turkce-gunluk', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'blogs', 'blog',
            ['/blog', 'sadece-turkce-gunluk']);
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
                {provide: LOCALE_ID, useValue: 'tr'}
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
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'gunlukler', 'gunluk',
            ['/gunluk', 'first-blog']);
        expect(comp.router.url)
            .toEqual('/tr/gunluk/ilk-gunluk');
    }));

});
