
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogDetailComponent } from './blog-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { BlogModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';

const activatedRouteStub = new ActivatedRouteStub();

describe('BlogDetailComponent', () => {
    let fixture: ComponentFixture<BlogDetailComponent>;
    let comp: BlogDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent,
                FooterComponent,
                SideBarComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: 'blog/:id', component: BlogDetailComponent},
                    {path: 'blogs', component: BlogDetailComponent},
                    {path: 'blogs/:pageNo', component: BlogDetailComponent},
                    {path: 'en/blog/:id', component: BlogDetailComponent},
                    {path: 'tr/blog/:id', component: BlogDetailComponent},
                    {path: 'en/blog', component: BlogDetailComponent},
                    {path: 'tr/blog', component: BlogDetailComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(BlogDetailComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should load first-blog', fakeAsync(() => {
        activatedRouteStub.setParamMap({ id: 'first-blog' });
        fixture.detectChanges();
        let lastBlog = new BlogModel();
        comp.blog$.subscribe(blog => {
            lastBlog = blog;
        });
        tick();
        expect(lastBlog.id)
            .toEqual('first-blog');
    }));

    it('should redirection to translation of page', fakeAsync(() => {
        activatedRouteStub.setParamMap({ id: 'first-blog' });
        fixture.detectChanges();
        comp.checkTranslation(undefined);
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/tr/blog/first-blog');
        fixture.detectChanges();
    }));

    it("should redirection to '/blog/first-blog' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({ id: '-1' });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/blog/first-blog');
        fixture.detectChanges();
    }));

});
