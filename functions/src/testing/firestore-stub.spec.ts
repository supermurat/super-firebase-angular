import { myData, noData } from './data.spec';
import {
    getArrayStartAfterByDocument,
    getArrayStartByNumberField, getArrayWhereByField,
    getDataByPath, getFirestoreQuerySnap,
    getFirestoreSnap, getRandomKey,
    getSortedArrayByNumberKey
} from './helpers.spec';

const firestoreStubEmpty = {
    doc(testData: any, path: string): any {
        const tData = getDataByPath(testData, path);
        const tDataSnap = getFirestoreSnap(tData);

        return {
            get(): any {
                return Promise.resolve(getFirestoreQuerySnap(tData).docs[0]);
            },
            set(data): any {
                return Promise.resolve([data]);
            }
        };
    },
    collection(testData: any, path: string, queryFn?: any): any {
        const tDataFull = getDataByPath(testData, path);
        const tDataSnapFull = getFirestoreSnap(tDataFull);

        let tData = tDataFull.slice();
        const tDataSnap = getFirestoreSnap(tData);

        return {
            get(): any {
                return Promise.resolve(getFirestoreQuerySnap(tData));
            },
            doc(pathDoc: string): any {
                return firestoreStubEmpty.doc(testData, pathDoc);
            },
            where(fieldPath: string, nopStr: string, value: any): any {
                tData = getArrayWhereByField(tData, fieldPath, nopStr, value);

                return {
                    limit(lim): any {
                        return {
                            get(): any {
                                return Promise.resolve(getFirestoreQuerySnap(tData));
                            }
                        };
                    }
                };
            }
        };
    }
};

export const firestoreStub = {
    doc(path: string): any {
        return firestoreStubEmpty.doc(myData, path);
    },
    collection(path: string, queryFn?: any): any {
        return firestoreStubEmpty.collection(myData, path, queryFn);
    }
};

export const firestoreStubNoData = {
    doc(path: string): any {
        return firestoreStubEmpty.doc(noData, path);
    },
    collection(path: string, queryFn?: any): any {
        return firestoreStubEmpty.collection(noData, path, queryFn);
    }
};
