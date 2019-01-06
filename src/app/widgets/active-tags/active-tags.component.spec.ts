import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertComponent } from '../../components/alert/alert.component';
import { AlertService } from '../../services';
import { angularFirestoreStub } from '../../testing/angular-firestore-stub.spec';
import { ActiveTagsComponent } from './active-tags.component';

describe('ActiveTagsComponent', () => {
    let fixture: ComponentFixture<ActiveTagsComponent>;
    let comp: ActiveTagsComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ActiveTagsComponent,
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
                    {path: '', component: ActiveTagsComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ActiveTagsComponent);
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

    it('should load taxonomy list', fakeAsync(() => {
        comp.taxonomyList$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

});
