
import { from } from 'rxjs';

// test data
const tData: Array<any> = [
    { id: 'first-blog', title: 'First Blog', content: 'this is good sample', contentSummary: 'this is good',
        created: { seconds: 1544207666 }},
    { id: 'second-blog', title: 'Second Blog', content: 'this is better sample',
        created: { seconds: 1544207667 }},
    { id: 'third-blog', title: 'Third Blog', content: 'this is the best sample',
        created: { seconds: 1544207668 }}
];

// test data snap
const tDataSnap: Array<any> = [];
tData.forEach(value => {
    tDataSnap.push({
        payload: {
            doc: {
                id: value.id,
                data(): any {
                    return value;
                }
            }
        }
    });
});

export const angularFirestoreStub = {
    doc(path: string): any {
        return {
            valueChanges(): any {
                return from([tData[0]]);
            }
        };
    },
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
                                        return from([tDataSnap]);
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                return from([tDataSnap]);
                            }};
                    }
                };
            }
        });

        return {
            valueChanges(): any {
                return from([tData]);
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
                                                    if (startAfterDoc.id === tData[0].id)
                                                        startAfterIndex = 1;
                                                    else if (startAfterDoc.id === tData[1].id)
                                                        startAfterIndex = 2;
                                                    else if (startAfterDoc.id === tData[2].id)
                                                        startAfterIndex = 3;

                                                const retVal = [];
                                                if (limitNumber === undefined ||
                                                    (limitNumber > 0 && startAfterIndex < tDataSnap.length))
                                                    retVal.push(queryFnMap(tDataSnap[startAfterIndex]));
                                                if (limitNumber === undefined ||
                                                    (limitNumber > 1 && startAfterIndex + 1 < tDataSnap.length))
                                                    retVal.push(queryFnMap(tDataSnap[startAfterIndex + 1]));
                                                if (limitNumber === undefined ||
                                                    (limitNumber > 2 && startAfterIndex + 2 < tDataSnap.length))
                                                    retVal.push(queryFnMap(tDataSnap[startAfterIndex + 2]));

                                                return retVal;
                                            }
                                        });
                                    }
                                });

                                return from([tDataSnap]);
                            }
                        });

                        return from([tData]);
                    },
                    subscribe(): any {
                        return from([tDataSnap]);
                    }
                };
            }
        };
    }
};
