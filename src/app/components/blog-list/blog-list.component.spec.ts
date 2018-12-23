
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogListComponent } from './blog-list.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, SeoService } from '../../services';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { angularFirestoreStub } from '../../testing';

describe('BlogListComponent', () => {
    let fixture: ComponentFixture<BlogListComponent>;
    let comp: BlogListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogListComponent,
                FooterComponent,
                SideBarComponent
            ],
            providers: [
                AlertService, SeoService,
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: 'blog', component: BlogListComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(BlogListComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
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
        comp.blogs$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

    it('trackByBlog(2) should return 2', async(() => {
        expect(comp.trackByBlog(2, {}))
            .toBe(2);
    }));

});
