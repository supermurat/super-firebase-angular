import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, PagerService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { PagerComponent } from '../pager/pager.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { JokeListComponent } from './joke-list.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('JokeListComponent', () => {
    let fixture: ComponentFixture<JokeListComponent>;
    let comp: JokeListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                JokeListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, PagerService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'jokes', redirectTo: 'jokes/1', pathMatch: 'full'},
                    {path: 'jokes/:pageNo', component: JokeListComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(JokeListComponent);
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

    it("should have as title 'Jokes'", async(() => {
        expect(comp.title)
            .toEqual('My Jokes');
    }));

    it('count of record should be 3', async(() => {
        activatedRouteStub.setParamMap({pageNo: 1});
        comp.jokes$.subscribe(result => {
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
            .toEqual('/jokes/1');
        fixture.detectChanges();
    }));

});
