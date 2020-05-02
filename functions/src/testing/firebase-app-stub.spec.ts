import { firestoreStub } from './firestore-stub.spec';
import { storageStub } from './storage-stub.spec';

export const firebaseAppStub = {
    name: 'unit-test-app',
    options: {},
    auth: undefined,
    database: undefined,
    instanceId: undefined,
    messaging: undefined,
    projectManagement: undefined,
    delete: undefined,
    securityRules: undefined,
    machineLearning: undefined,
    remoteConfig: undefined,
    firestore: (): any =>
        firestoreStub,
    storage: (): any =>
        storageStub
};
