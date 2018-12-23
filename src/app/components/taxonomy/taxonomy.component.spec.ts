
import { from } from 'rxjs';
import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TaxonomyComponent } from './taxonomy.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, PaginationService, SeoService } from '../../services';
import { BlogModel } from '../../models';
import { SideBarComponent } from '../side-bar/side-bar.component';

import { ScrollableDirective } from '../../directives';

const testDataTX: Array<Array<BlogModel>> = [[
    { id: 'first-blog', title: 'First Blog', content: 'this is good sample', created: { seconds: 1544207666 }},
    { id: 'second-blog', title: 'Second Blog', content: 'this is better sample', created: { seconds: 1544207667 }},
    { id: 'third-blog', title: 'Third Blog', content: 'this is the best sample', created: { seconds: 1544207668 }}
]];
const testDataSnapshotTX: any = [[
    {payload: {doc: {id: 'first-blog', data(): BlogModel {
                    return testDataTX[0][0];
                }}}},
    {payload: {doc: {id: 'second-blog', data(): BlogModel {
                    return testDataTX[0][1];
                }}}},
    {payload: {doc: {id: 'third-blog', data(): BlogModel {
                    return testDataTX[0][2];
                }}}}
]];

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
            {
                valueChanges: jasmine.createSpy('valueChanges').and
                    .returnValue(from([testDataSnapshotTX[0][0].payload.doc.data()]))
            }),
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
                                        return from(testDataSnapshotTX);
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                return from(testDataSnapshotTX);
                            }};
                    }
                };
            }
        });

        return {
            valueChanges(): any {
                return from(testDataTX);
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
                                                    if (startAfterDoc.id === testDataTX[0][0].id)
                                                        startAfterIndex = 1;
                                                    else if (startAfterDoc.id === testDataTX[0][1].id)
                                                        startAfterIndex = 2;
                                                    else if (startAfterDoc.id === testDataTX[0][2].id)
                                                        startAfterIndex = 3;

                                                const retVal = [];
                                                if (limitNumber > 0 && startAfterIndex < testDataSnapshotTX[0].length)
                                                    retVal.push(queryFnMap(testDataSnapshotTX[0][startAfterIndex]));
                                                if (limitNumber > 1 && startAfterIndex + 1 < testDataSnapshotTX[0].length)
                                                    retVal.push(queryFnMap(testDataSnapshotTX[0][startAfterIndex + 1]));
                                                if (limitNumber > 2 && startAfterIndex + 2 < testDataSnapshotTX[0].length)
                                                    retVal.push(queryFnMap(testDataSnapshotTX[0][startAfterIndex + 2]));

                                                return retVal;
                                            }
                                        });
                                    }
                                });

                                return from(testDataSnapshotTX);
                            }
                        });

                        return {
                            pipe(): any {
                                return {
                                    subscribe(): any {
                                        return from(testDataSnapshotTX);
                                    }};
                            }
                        };
                    }
                };
            }
        };
    }
};

describe('TaxonomyComponent', () => {
    let fixture: ComponentFixture<TaxonomyComponent>;
    let comp: TaxonomyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaxonomyComponent,
                SideBarComponent,
                ScrollableDirective
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: TaxonomyComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TaxonomyComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

});
