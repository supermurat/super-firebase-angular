import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
    let fixture: ComponentFixture<ContactComponent>;
    let comp: ContactComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContactComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: 'contact', pathMatch: 'full'},
                    {path: 'contact', component: ContactComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ContactComponent);
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

    it('should send a new message', fakeAsync(() => {
        comp.contact = {
            userLongName: 'New Unit Test',
            email: 'new@test.com',
            message: 'This is for new test!',
            isSendCopyToOwner: true,
            isAgreed: true
        };
        comp.onClickSend();
        tick();
        fixture.detectChanges();

        expect(comp.isShowThankYou)
            .toBeTruthy();
        expect(comp.contact)
            .toEqual({});
    }));

});
