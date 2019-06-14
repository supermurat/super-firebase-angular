import { firestoreStub, firestoreStubNoData } from './firestore-stub.spec';
import { storageStub } from './storage-stub.spec';

export const firebaseAppStubEmpty = {
    name: 'unit-test-app',
    options: {},
    auth: undefined,
    database: undefined,
    instanceId: undefined,
    messaging: undefined,
    projectManagement: undefined,
    delete: undefined
};

export const firebaseAppStub = {...firebaseAppStubEmpty, ...{
        firestore: (): any =>
            firestoreStub,
        storage: (): any =>
            storageStub
    }
};

export const firebaseAppStubNoData = {...firebaseAppStubEmpty, ...{
    firestore: (): any =>
        firestoreStubNoData,
    storage: (): any =>
        storageStub
    }
};
