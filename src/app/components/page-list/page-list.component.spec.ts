
import { from } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { PageListComponent } from './page-list.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, SeoService } from '../../services';
import { PageModel } from '../../models';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

const testData: any = [[
    {payload: {doc: {id: 'first-page', data(): PageModel {
        return { id: 'first-page', title: 'First Page', content: 'this is good sample'};
    }}}},
    {payload: {doc: {id: 'second-page', data(): PageModel {
        return { id: 'second-page', title: 'Second Page', content: 'this is better sample'};
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

describe('PageListComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PageListComponent,
                FooterComponent,
                SideBarComponent
            ],
            providers: [
                AlertService, SeoService,
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: 'page', component: PageListComponent}])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'This is temporary page list'", async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('This is temporary page list');
    }));

    it('count of page should be 2', async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        app.pages$.subscribe(result => {
            expect(result.length)
                .toEqual(2);
        });
        fixture.detectChanges();
    }));

    it('trackByPage(2) should return 2', async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.trackByPage(2, {}))
            .toBe(2);
    }));

});
