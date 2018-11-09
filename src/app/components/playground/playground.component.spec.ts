import { async, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { PlaygroundComponent } from './playground.component';

import { AlertService, PaginationService, SeoService } from '../../services';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { Blog } from '../../models';
import { from } from 'rxjs';

const testData: Array<Array<Blog>> = [[
    { name: 'first-block', bio: 'this is good sample', imgName: 'bad, very bad angel.gif', imgURL: undefined},
    { name: 'second-block', bio: 'this is better sample', imgName: 'bad, very bad angel.gif', imgURL: undefined}
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

describe('PlaygroundComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PlaygroundComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: AngularFirestore, useValue: angularFirestoreStub }
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
                { provide: AngularFirestore, useValue: angularFirestoreStub }
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
