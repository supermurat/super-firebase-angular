import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigModel } from '../../models';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
    let fixture: ComponentFixture<SideBarComponent>;
    let comp: SideBarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TestHelperModule,
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

    it('should load config properly', fakeAsync(() => {
        comp.pageService.getDocumentFromFirestore(ConfigModel, `configs/public_${comp.pageService.locale}`)
            .subscribe(config => {
                comp.configService.init(config);
            });
        tick();
        expect(comp.customHtml.title)
            .toBe('Project is Ready');
    }));

});
