import { from } from 'rxjs';

// test data
const tData: Array<any> = ['https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com' +
'/o/blogs%2Fbad%2C%20very%20bad%20angel.gif?alt=media&token=382c3835-1ee6-4d2f-81b3-570e0a1f3086'];

export const angularFireStorageStub = {
    ref(path: string): any {
        return {
            getDownloadURL(): any {
                return from(tData);
            }
        };
    }
};
