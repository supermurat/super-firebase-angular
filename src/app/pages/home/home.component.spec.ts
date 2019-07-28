import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigModel } from '../../models';
import { angularFirestoreStubNoData } from '../../testing/angular-firestore-stub.spec';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: HomeComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
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

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.pageService.trackByIndex(2, {}))
            .toBe(2);
    }));

    it('should load home page contents properly with uniqueKey for TransferState', fakeAsync(() => {
        const contents$ = comp.pageService.getCollectionFromFirestore(`pages_${comp.locale}/home/contents`,
            ref => ref.orderBy('orderNo')
                .limit(3), 'unit-test');
        let lastContents = [];
        contents$.subscribe(values => {
            lastContents = values;
        });
        tick();
        expect(lastContents.length)
            .toBe(3);
    }));

    it('should load config properly', fakeAsync(() => {
        comp.pageService.getDocumentFromFirestore(ConfigModel, `configs/public_${comp.locale}`)
            .subscribe(config => {
                comp.configService.init(config);
            });
        tick();
        expect(comp.customHtml.title)
            .toBe('Project is Ready');
    }));

    it('should load config properly even if initialized after already got', fakeAsync(() => {
        comp.pageService.getDocumentFromFirestore(ConfigModel, `configs/public_${comp.locale}`)
            .subscribe(config => {
                comp.configService.init(config);
            });
        tick();
        // tslint:disable-next-line:no-lifecycle-call
        comp.ngOnInit();
        tick();
        expect(comp.customHtml.title)
            .toBe('Project is Ready');
    }));

});

describe('HomeComponentNoData', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                {provide: AngularFirestore, useValue: angularFirestoreStubNoData}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: HomeComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
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

});
