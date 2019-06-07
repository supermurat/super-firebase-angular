import { getStorageFiles } from './helpers.spec';

// test data
const tData: Array<any> = ['https://storage.googleapis.com/super-murat-beta.appspot.com/publicFiles/bad%2C%20very%20bad%20angel.gif'];

export const storageStub = {
    bucket(bucketName: string): any {
        return {
            getFiles(query): any {
                return Promise.resolve([getStorageFiles(tData)]);
            }
        };
    }
};
