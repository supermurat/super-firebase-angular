import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService } from '../../services';
import { angularFirestoreStub } from '../../testing/angular-firestore-stub.spec';
import { AlertComponent } from '../alert/alert.component';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
    let fixture: ComponentFixture<SideBarComponent>;
    let comp: SideBarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SideBarComponent,
                AlertComponent
            ],
            providers: [
                AlertService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: SideBarComponent},
                    {path: 'search', component: SideBarComponent},
                    {path: 'search/**', component: SideBarComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SideBarComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create', () => {
        expect(comp)
            .toBeTruthy();
    });

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

    it('should redirect to "/search" for "Searched For Me"', fakeAsync(() => {
        comp.searchFor = 'Searched For Me';
        comp.onClickSearch();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/search?q=Searched%20For%20Me');
    }));

    it('should load taxonomy list', fakeAsync(() => {
        comp.taxonomyList$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

    it('should load jokes', fakeAsync(() => {
        comp.jokes$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

});
