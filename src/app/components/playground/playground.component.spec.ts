import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { PlaygroundComponent } from './playground.component';

import { AlertService, PaginationService, SeoService } from '../../services';
import { ScrollableDirective } from '../../directives';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { By } from '@angular/platform-browser';
import { angularFireStorageStub, angularFirestoreStub } from '../../testing/index.spec';

describe('PlaygroundComponent', () => {
    let fixture: ComponentFixture<PlaygroundComponent>;
    let comp: PlaygroundComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PlaygroundComponent,
                ScrollableDirective
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireStorage, useValue: angularFireStorageStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: PlaygroundComponent}]),
                NgbModule
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PlaygroundComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('imgURL of image stored on firebase should be predefined', fakeAsync(() => {
        comp.imgURL$.subscribe(blog => {
            tick();
            fixture.detectChanges();
            expect(comp.imgURL)
                .toEqual('https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com' +
                    '/o/blogs%2Fbad%2C%20very%20bad%20angel.gif?alt=media&token=382c3835-1ee6-4d2f-81b3-570e0a1f3086');
        });
        tick();
        fixture.detectChanges();
    }));

    it('scrollHandler("bottom") should load more data', fakeAsync(() => {
        tick();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.scrollHandler('bottom');
        tick();
        expect(countOfItem)
            .toEqual(3);
    }));

    it('double call scrollHandler("bottom") should load all data', fakeAsync(() => {
        tick();
        let lastResult = false;
        comp.pagination.done.subscribe(result => {
            lastResult = result;
        });
        comp.scrollHandler('bottom');
        tick();
        comp.scrollHandler('bottom');
        tick();
        expect(lastResult)
            .toBeTruthy();
    }));

    it('scrollHandler("top") should not load more data', fakeAsync(() => {
        tick();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.scrollHandler('top');
        tick();
        expect(countOfItem)
            .toEqual(2);
    }));

    it('pagination.reset() should not clear data', fakeAsync(() => {
        tick();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.pagination.reset();
        tick();
        expect(countOfItem)
            .toEqual(2);
    }));

    it('scrollHandler("bottom") should not load data after pagination.reset()', fakeAsync(() => {
        tick();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.pagination.reset();
        tick();
        comp.scrollHandler('bottom');
        tick();
        expect(countOfItem)
            .toEqual(2);
    }));

    it('pagination.init() should load data with alternate options { reverse: false, prepend: true }', fakeAsync(() => {
        comp.pagination.init(`blogs_${comp.locale}`, 'created', { reverse: false, prepend: true });
        tick();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.scrollHandler('bottom');
        tick();
        expect(countOfItem)
            .toEqual(3);
    }));

    it('pagination.init() should not load more data all data already loaded', fakeAsync(() => {
        tick();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        comp.scrollHandler('bottom');
        tick();
        comp.scrollHandler('bottom');
        tick();
        comp.pagination.init(`blogs_${comp.locale}`, 'created', { reverse: true, prepend: false }, false);
        tick();
        expect(countOfItem)
            .toEqual(3);
    }));

    it('.content.onScroll should load more data', fakeAsync(() => {
        tick();
        let countOfItem = 0;
        comp.pagination.data.subscribe(result => {
            countOfItem = result.length;
        });
        const div = fixture.debugElement.query(By.css('.content'));
        div.nativeElement.scrollTop = 200;
        div.triggerEventHandler('scroll', {target: {scrollTop: 200}});
        tick();
        expect(countOfItem)
            .toEqual(3);
    }));

});

describe('PlaygroundComponentAsync', () => {
    let fixture: ComponentFixture<PlaygroundComponent>;
    let comp: PlaygroundComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PlaygroundComponent,
                ScrollableDirective
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireStorage, useValue: angularFireStorageStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: PlaygroundComponent}]),
                NgbModule
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PlaygroundComponent);
                comp = fixture.componentInstance;
            });
    }));

    it("should render 'Browser side rendering with Firebase 🔥 Build Test' in a h2", async(() => {
        expect(fixture.nativeElement.querySelector('h2').textContent)
            .toContain('Browser side rendering with Firebase 🔥 Build Test');
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it("should have as title 'Play Ground'", async(() => {
        expect(comp.title)
            .toEqual('Play Ground');
    }));

    it('male() should set gender as male', async(() => {
        comp.male();
        fixture.detectChanges();
        expect(comp.gender)
            .toBe('male');
    }));

    it('female() should set gender as female', async(() => {
        comp.female();
        fixture.detectChanges();
        expect(comp.gender)
            .toBe('female');
    }));

    it('other() should set gender as other', async(() => {
        comp.other();
        fixture.detectChanges();
        expect(comp.gender)
            .toBe('other');
    }));

    it('inc(2) should set minutes as 2', async(() => {
        comp.inc(2);
        fixture.detectChanges();
        expect(comp.minutes)
            .toBe(2);
    }));

    it('openAlert() should alert user', async(() => {
        comp.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('This is alert test');
            });
        comp.openAlert();
        fixture.detectChanges();
    }));

    it('trackByBlog(2) should return 2', async(() => {
        expect(comp.trackByBlog(2, {}))
            .toBe(2);
    }));

});

describe('PlaygroundComponentServer', () => {
    let fixture: ComponentFixture<PlaygroundComponent>;
    let comp: PlaygroundComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PlaygroundComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: PLATFORM_ID, useValue: 'server' },
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireStorage, useValue: angularFireStorageStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: PlaygroundComponent}]),
                NgbModule
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PlaygroundComponent);
                comp = fixture.componentInstance;
            });
    }));

    it("should render 'Server side rendering with Firebase 🔥 Build Test' in a h2", async(() => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h2').textContent)
            .toContain('Server side rendering with Firebase 🔥 Build Test');
    }));

    it('openAlert() should alert user', async(() => {
        comp.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('This is alert test');
            });
        comp.openAlert();
        fixture.detectChanges();
    }));

});
