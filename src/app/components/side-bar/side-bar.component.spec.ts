import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService, ConfigService } from '../../services';
import { angularFirestoreStub } from '../../testing/angular-firestore-stub.spec';
import { ActiveTagsComponent } from '../../widgets/active-tags/active-tags.component';
import { CustomHtmlComponent } from '../../widgets/custom-html/custom-html.component';
import { LastJokesComponent } from '../../widgets/last-jokes/last-jokes.component';
import { SearchBarComponent } from '../../widgets/search-bar/search-bar.component';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
    let fixture: ComponentFixture<SideBarComponent>;
    let comp: SideBarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SideBarComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent,
                CustomHtmlComponent
            ],
            providers: [
                AlertService, ConfigService,
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

});
