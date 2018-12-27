import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '../../services';
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
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: SideBarComponent},
                    {path: 'search', component: SideBarComponent}
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
