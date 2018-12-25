
import { from } from 'rxjs';
import {
    getArrayStartAfterByDocument,
    getArrayStartByNumberField, getArrayWhereByField,
    getDataByPath,
    getFirestoreSnap,
    getSortedArrayByNumberKey
} from './helpers.spec';

export const angularFirestoreStub = {
    doc(path: string): any {
        const tData = getDataByPath(path);
        const tDataSnap = getFirestoreSnap(tData);

        return {
            valueChanges(): any {
                return from([tData[0]]);
            }
        };
    },
    collection(path: string, queryFn?: any): any {
        let limitNumberValue = -1;

        const tDataFull = getDataByPath(path);
        const tDataSnapFull = getFirestoreSnap(tDataFull);

        let tData = tDataFull.slice();
        let tDataSnap = getFirestoreSnap(tData);

        queryFn({
            orderBy(fieldPath): any {
                tData = getSortedArrayByNumberKey(tData, fieldPath);
                tDataSnap = getFirestoreSnap(tData);

                return {
                    limit(limitNumber): any {
                        limitNumberValue = limitNumber;

                        return {
                            startAfter(startAfterDoc): any {
                                tData = getArrayStartAfterByDocument(tData, startAfterDoc);
                                tData = tData.slice(0, limitNumber);
                                tDataSnap = getFirestoreSnap(tData);

                                return {
                                    snapshotChanges(): any {
                                        return from([tDataSnap]);
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                tData = tData.slice(0, limitNumber);
                                tDataSnap = getFirestoreSnap(tData);

                                return from([tDataSnap]);
                            }};
                    },
                    startAt(startAtValue): any {
                        tData = getArrayStartByNumberField(tData, fieldPath, startAtValue);
                        tDataSnap = getFirestoreSnap(tData);

                        return {
                            limit(limitNumber): any {
                                limitNumberValue = limitNumber;
                                tData = tData.slice(0, limitNumber);
                                tDataSnap = getFirestoreSnap(tData);

                                return {fieldPath};
                            }
                        };
                    }
                };
            },
            where(fieldPath, opStr, value): any {
                tData = getArrayWhereByField(tData, fieldPath, opStr, value);
                tDataSnap = getFirestoreSnap(tData);

                return {
                    limit(limitNumber): any {
                        limitNumberValue = limitNumber;

                        return {
                            startAfter(startAfterDoc): any {
                                tData = getArrayStartAfterByDocument(tData, startAfterDoc);
                                tData = tData.slice(0, limitNumber);
                                tDataSnap = getFirestoreSnap(tData);

                                return {
                                    snapshotChanges(): any {
                                        return from([tDataSnap]);
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                tData = tData.slice(0, limitNumber);
                                tDataSnap = getFirestoreSnap(tData);

                                return from([tDataSnap]);
                            }};
                    }
                };
            }
        });
        if (limitNumberValue > -1) {
            tData = tData.slice(0, limitNumberValue);
            tDataSnap = getFirestoreSnap(tData);
        }

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
                                                const retVal: Array<any> = [];
                                                tDataSnap.forEach(item => {
                                                    retVal.push(queryFnMap(item));
                                                });

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
                    subscribe(queryFnSubscribe): any {
                        queryFnSubscribe(tDataSnap);

                        return from([tDataSnap]);
                    }
                };
            }
        };
    }
};
