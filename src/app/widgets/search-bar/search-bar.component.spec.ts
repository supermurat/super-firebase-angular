import { NgZone } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
    let fixture: ComponentFixture<SearchBarComponent>;
    let comp: SearchBarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: SearchBarComponent},
                    {path: 'search', component: SearchBarComponent},
                    {path: 'search/**', component: SearchBarComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SearchBarComponent);
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

    it('should redirect to "/search" for "Searched For Me"', fakeAsync(() => {
        comp.searchFor = 'Searched For Me';
        fixture.debugElement.injector.get(NgZone)
            .run(() => {
                comp.onClickSearch();
            });
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/search?q=Searched%20For%20Me');
    }));

});
