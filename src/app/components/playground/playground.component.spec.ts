import { async, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { PlaygroundComponent } from './playground.component';

import { AlertService, PaginationService, SeoService } from '../../services';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Blog } from '../../models';
import { from } from 'rxjs';

const testData: Array<Array<Blog>> = [[
    { id: 'first-blog', title: 'First Blog', content: 'this is good sample'},
    { id: 'second-blog', title: 'Second Blog', content: 'this is better sample'}
]];

const angularFirestoreStub = {
    collection(path: string, queryFn?: any): any {
        queryFn({
            orderBy(fieldPath): any {
                return {
                    limit(limitNumber): any {
                        return {
                            startAfter(c): any {
                                return {
                                    snapshotChanges(): any {
                                        return {
                                        };
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                return {
                                };
                            }};
                    }
                };
            }
        });

        return {
            valueChanges(): any {
                return from(testData);
            },
            snapshotChanges(): any {
                return {
                    pipe(): any {
                        return {
                            pipe(): any {
                                return {
                                    subscribe(): any {
                                        return {};
                                    }};
                            }
                        };
                    }
                };
            }
        };
    }
};

const angularFireStorageStub = {
    ref: jasmine.createSpy('ref').and
        .returnValue(
            {
                getDownloadURL: jasmine.createSpy('getDownloadURL').and
                    .returnValue(
                        from(['https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com' +
                        '/o/blogs%2Fbad%2C%20very%20bad%20angel.gif?alt=media&token=382c3835-1ee6-4d2f-81b3-570e0a1f3086']))
            })
};

describe('PlaygroundComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PlaygroundComponent
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
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'Play Ground'", async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('Play Ground');
    }));

    it("should render 'Browser side rendering with Firebase 🔥 Build Test' in a h2", async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent)
            .toContain('Browser side rendering with Firebase 🔥 Build Test');
    }));

    it('male() should set gender as male', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.male();
        fixture.detectChanges();
        expect(app.gender)
            .toBe('male');
    }));

    it('female() should set gender as female', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.female();
        fixture.detectChanges();
        expect(app.gender)
            .toBe('female');
    }));

    it('other() should set gender as other', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.other();
        fixture.detectChanges();
        expect(app.gender)
            .toBe('other');
    }));

    it('inc(2) should set minutes as 2', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.inc(2);
        fixture.detectChanges();
        expect(app.minutes)
            .toBe(2);
    }));

    it('openAlert() should alert user', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('This is alert test');
            });
        app.openAlert();
        fixture.detectChanges();
    }));

    it('imgURL of image stored on firebase should be predefined', fakeAsync(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        app.imgURL$.subscribe(blog => {
            tick();
            fixture.detectChanges();
            expect(app.imgURL)
                .toEqual('https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com' +
                    '/o/blogs%2Fbad%2C%20very%20bad%20angel.gif?alt=media&token=382c3835-1ee6-4d2f-81b3-570e0a1f3086');
        });
        tick();
        fixture.detectChanges();
    }));

});

describe('PlaygroundComponentServer', () => {
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
            .compileComponents();
    }));

    it("should render 'Server side rendering with Firebase 🔥 Build Test' in a h2", async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent)
            .toContain('Server side rendering with Firebase 🔥 Build Test');
    }));

    it('openAlert() should alert user', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('This is alert test');
            });
        app.openAlert();
        fixture.detectChanges();
    }));

});
