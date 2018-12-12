
import { from } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';

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
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'Murat Demir's blog'", async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('Murat Demir\'s blog');
    }));

    it('count of blog should be 2', async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        app.blogs$.subscribe(result => {
            expect(result.length)
                .toEqual(2);
        });
        fixture.detectChanges();
    }));

    it('trackByBlog(2) should return 2', async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.trackByBlog(2, {}))
            .toBe(2);
    }));

});
