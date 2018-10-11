import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogListComponent } from './blog-list.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, SeoService } from '../../services';
import { Observable } from 'rxjs';
import { Blog } from '../../models/blog';
import 'rxjs-compat/add/observable/from';

const testData: Array<Array<Blog>> = [[
    { name: 'first-block', bio: 'this is good sample', imgName: 'bad, very bad angel.gif', imgURL: undefined},
    { name: 'second-block', bio: 'this is better sample', imgName: 'bad, very bad angel.gif', imgURL: undefined}
]];

const angularFirestoreStub = {
    collection(path: string, queryFn?: any): any {
        queryFn({orderBy(fieldPath): any { return {fieldPath}; }});

        return {
            valueChanges(): any {
                return Observable.from(testData);
            }
        };
    }
};

describe('BlogListComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogListComponent
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

    it("should have as title 'Blog App'", async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('Blog App');
    }));

    it("should render 'Blog Entries' in a h2", async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent)
            .toContain('Blog Entries');
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
