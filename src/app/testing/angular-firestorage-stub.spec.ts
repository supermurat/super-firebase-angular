import { from } from 'rxjs';

// test data
const tData: Array<any> = ['https://storage.googleapis.com/super-murat-test.appspot.com/publicFiles/bad%2C%20very%20bad%20angel.gif'];

export const angularFireStorageStub = {
    ref(path: string): any {
        return {
            getDownloadURL(): any {
                return from(tData);
            }
        };
    }
};
