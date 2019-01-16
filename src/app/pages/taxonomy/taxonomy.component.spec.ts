import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TaxonomyModel } from '../../models';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { TaxonomyComponent } from './taxonomy.component';

describe('TaxonomyComponent', () => {
    let fixture: ComponentFixture<TaxonomyComponent>;
    let comp: TaxonomyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaxonomyComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: TaxonomyComponent},
                    {path: 'tag/:id', component: TaxonomyComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
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

    it('should load first-tag', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-tag'});
        fixture.detectChanges();
        let lastTag = new TaxonomyModel();
        comp.tag$.subscribe(tag => {
            lastTag = tag;
        });
        tick();
        expect(lastTag.id)
            .toEqual('first-tag');
    }));

    it('scrollHandler("bottom") should load more data', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-tag'});
        tick();
        fixture.detectChanges();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.scrollHandler('bottom');
        tick();
        expect(countOfItem)
            .toEqual(8);
    }));

    it('scrollHandler("top") should not load more data', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-tag'});
        tick();
        fixture.detectChanges();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        tick();
        comp.scrollHandler('top');
        tick();
        expect(countOfItem)
            .toEqual(5);
    }));

});
