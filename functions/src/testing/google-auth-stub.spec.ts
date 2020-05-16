// test data

export const googleAuthStubConfig = {
    isFail: false
};

export const googleAuthStub = {
    getCredentials(): Promise<any> {
        return Promise.resolve({
            client_email: 'unit@test.com'
        });
    },
    getClient(): Promise<any> {
        return Promise.resolve({
            request<T = any>(opts: any): Promise<any> {
                return googleAuthStubConfig.isFail ? Promise.reject('Marked to fail!') : Promise.resolve();
            }
        });
    }
};
