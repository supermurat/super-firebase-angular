
import { from } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogListComponent } from './blog-list.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, SeoService } from '../../services';
import { BlogModel } from '../../models';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

const testData: any = [[
    {payload: {doc: {id: 'first-blog', data(): BlogModel {
        return { id: 'first-blog', title: 'First Blog', content: 'this is good sample', contentSummary: 'this is good'};
    }}}},
    {payload: {doc: {id: 'second-blog', data(): BlogModel {
        return { id: 'second-blog', title: 'Second Blog', content: 'this is better sample'};
    }}}}
]];

const angularFirestoreStub = {
    collection(path: string, queryFn?: any): any {
        queryFn({orderBy(fieldPath): any { return {fieldPath}; }});

        return {
            snapshotChanges(): any {
                return from(testData);
            }
        };
    }
};

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

    it('count of blog should be 2', async(() => {
        comp.blogs$.subscribe(result => {
            expect(result.length)
                .toEqual(2);
        });
        fixture.detectChanges();
    }));

    it('trackByBlog(2) should return 2', async(() => {
        expect(comp.trackByBlog(2, {}))
            .toBe(2);
    }));

});
