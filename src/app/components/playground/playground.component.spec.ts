import { async, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { PlaygroundComponent } from './playground.component';

import { AlertService, PaginationService, SeoService } from '../../services';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { BlogModel } from '../../models';
import { from, Observable } from 'rxjs';

const testData: Array<Array<BlogModel>> = [[
    { id: 'first-blog', title: 'First Blog', content: 'this is good sample'},
    { id: 'second-blog', title: 'Second Blog', content: 'this is better sample'},
    { id: 'third-blog', title: 'Third Blog', content: 'this is the best sample'}
]];
const testDataSnapshot: any = [[
    {payload: {doc: {id: 'first-blog', data(): BlogModel {
                    return testData[0][0];
                }}}},
    {payload: {doc: {id: 'second-blog', data(): BlogModel {
                    return testData[0][1];
                }}}},
    {payload: {doc: {id: 'third-blog', data(): BlogModel {
                    return testData[0][2];
                }}}}
]];

const angularFirestoreStub = {
    collection(path: string, queryFn?: any): any {
        let fieldPath: string;
        let limitNumber: number;
        let startAfterDoc: any;

        queryFn({
            orderBy(fp): any {
                fieldPath = fp;

                return {
                    limit(ln): any {
                        limitNumber = ln;

                        return {
                            startAfter(sad): any {
                                startAfterDoc = sad;

                                return {
                                    snapshotChanges(): any {
                                        return from(testDataSnapshot);
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                return from(testDataSnapshot);
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
                    pipe(queryFnPipe?: any): any {
                        queryFnPipe({
                            lift(queryFnLift?: any): any {
                                queryFnLift.call({}, {
                                    subscribe(queryFnSubscribe): any {
                                        queryFnSubscribe._next({
                                            map(queryFnMap): any {
                                                let startAfterIndex = 0;
                                                if (startAfterDoc)
                                                    if (startAfterDoc.id === testData[0][0].id)
                                                        startAfterIndex = 1;
                                                    else if (startAfterDoc.id === testData[0][1].id)
                                                        startAfterIndex = 2;
                                                    else if (startAfterDoc.id === testData[0][2].id)
                                                        startAfterIndex = 3;

                                                const retVal = [];
                                                if (limitNumber > 0 && startAfterIndex < testDataSnapshot[0].length) {
                                                    queryFnMap(testDataSnapshot[0][startAfterIndex]);
                                                    retVal.push(testDataSnapshot[0][startAfterIndex].payload);
                                                }
                                                if (limitNumber > 1 && startAfterIndex + 1 < testDataSnapshot[0].length) {
                                                    queryFnMap(testDataSnapshot[0][startAfterIndex + 1]);
                                                    retVal.push(testDataSnapshot[0][startAfterIndex + 1].payload);
                                                }
                                                if (limitNumber > 2 && startAfterIndex + 2 < testDataSnapshot[0].length) {
                                                    queryFnMap(testDataSnapshot[0][startAfterIndex + 2]);
                                                    retVal.push(testDataSnapshot[0][startAfterIndex + 2].payload);
                                                }

                                                return retVal;
                                            }
                                        });
                                    }
                                });

                                return from(testDataSnapshot);
                            }
                        });

                        return {
                            pipe(): any {
                                return {
                                    subscribe(): any {
                                        return from(testDataSnapshot);
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

    it('trackByBlog(2) should return 2', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.trackByBlog(2, {}))
            .toBe(2);
    }));

    it('scrollHandler("bottom") should load more data', fakeAsync(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        tick();
        app.scrollHandler('bottom');
        fixture.detectChanges();
        tick();
        let countOfItem = 0;
        app.page.data.subscribe(result => {
            countOfItem += result.length;
        }, undefined, () => {
            expect(countOfItem)
                .toEqual(3);
        });
    }));

    it('scrollHandler("top") should not load more data', fakeAsync(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        tick();
        app.scrollHandler('top');
        fixture.detectChanges();
        tick();
        let countOfItem = 0;
        app.page.data.subscribe(result => {
            countOfItem += result.length;
        }, undefined, () => {
            expect(countOfItem)
                .toEqual(2);
        });
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
