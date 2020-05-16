import { firestoreStub } from './firestore-stub.spec';
import { storageStub } from './storage-stub.spec';

export const firebaseAppStub = {
    name: 'unit-test-app',
    firestore: (): any =>
        firestoreStub,
    storage: (): any =>
        storageStub
};
