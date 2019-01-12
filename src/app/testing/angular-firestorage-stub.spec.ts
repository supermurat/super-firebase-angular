import { from } from 'rxjs';

// test data
const tData: Array<any> = ['https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com' +
'/o/publicFiles%2Fbad%2C%20very%20bad%20angel.gif?alt=media&token=f2f41a6f-dc13-47f4-85d4-853c0ff16898'];

export const angularFireStorageStub = {
    ref(path: string): any {
        return {
            getDownloadURL(): any {
                return from(tData);
            }
        };
    }
};
