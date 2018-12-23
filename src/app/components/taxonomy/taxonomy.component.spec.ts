
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TaxonomyComponent } from './taxonomy.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, PaginationService, SeoService } from '../../services';
import { SideBarComponent } from '../side-bar/side-bar.component';

import { ScrollableDirective } from '../../directives';
import { angularFirestoreStub } from '../../testing';

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
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: TaxonomyComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TaxonomyComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
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
