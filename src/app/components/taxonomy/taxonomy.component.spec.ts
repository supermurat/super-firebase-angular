import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ScrollableDirective } from '../../directives';
import { AlertService, PaginationService, SeoService } from '../../services';
import { angularFirestoreStub } from '../../testing/index.spec';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { TaxonomyComponent } from './taxonomy.component';

describe('TaxonomyComponent', () => {
    let fixture: ComponentFixture<TaxonomyComponent>;
    let comp: TaxonomyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaxonomyComponent,
                SideBarComponent,
                ScrollableDirective
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: angularFirestoreStub}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([{path: '', component: TaxonomyComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TaxonomyComponent);
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
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

});
