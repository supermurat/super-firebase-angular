/**
 * get snap of data
 * @param tData: to get snap of it
 */
export const getFirestoreSnap = (tData: Array<any>): Array<any> => {
    const tDataSnap: Array<any> = [];
    tData.forEach(value => {
        tDataSnap.push({
            payload: {
                doc: {
                    id: value.id,
                    data(): any {
                        return value;
                    }
                }
            }
        });
    });

    return tDataSnap;
};

/**
 * get data from json test data by field path
 * @param testData: test data for firestore
 * @param path: to get data of it
 */
export const getDataByPath = (testData: any, path: string): Array<any> => {
    const paths = path.split('/');
    const tData: Array<any> = [];
    Object.keys(testData)
        .forEach((prop: string) => {
            if (paths[0] === prop) {
                Object.keys(testData[prop])
                    .forEach((subProp: string) => {
                        if (paths.length > 1) {
                            if (paths[1] === subProp) {
                                if (paths.length > 2) {
                                    Object.keys(testData[prop][subProp])
                                        .forEach((subProp2: string) => {
                                            if (`__collection__${paths[2]}` === subProp2) {
                                                Object.keys(testData[prop][subProp][subProp2])
                                                    .forEach((subProp3: string) => {
                                                        tData.push(testData[prop][subProp][subProp2][subProp3]);
                                                    });

                                                return tData;
                                            }
                                        });
                                } else {
                                    tData.push(testData[prop][subProp]);

                                    return tData;
                                }
                            }
                        } else {
                            tData.push(testData[prop][subProp]);
                        }
                    });

                return tData;
            }
        });

    return tData;
};

/**
 * get snap of data from json test data by field path
 * @param testData: test data for firestore
 * @param path: to get snap data of it
 */
export const getFirestoreSnapByPath = (testData: any, path: string): Array<any> => getFirestoreSnap(getDataByPath(testData, path));

/**
 * get sorted array by number key
 * @param array: to sort
 * @param key: to sort by
 */
export const getSortedArrayByNumberKey = (array: Array<any>, key: string): Array<any> => array.sort((a, b) => {
    const x = a[key];
    const y = b[key];

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
});

/**
 * get array start after by document
 * @param array: to filter
 * @param doc: to start after by
 */
export const getArrayStartAfterByDocument = (array: Array<any>, doc: any): Array<any> => {
    let startAfterIndex = 0;
    for (let i = 0; i < array.length; i++) {
        if (doc.id === array[i].id) {
            startAfterIndex = i + 1;
        }
    }

    return array.slice(startAfterIndex);
};

/**
 * get array start by number field path
 * @param array: to filter
 * @param fieldPath: to start by field
 * @param startValue: to start value
 */
export const getArrayStartByNumberField = (array: Array<any>, fieldPath: string, startValue: number): Array<any> => {
    const tData: Array<any> = [];
    array.forEach(item => {
        if (item[fieldPath] >= startValue) {
            tData.push(item);
        }
    });

    return tData;
};

/**
 * get filtered array by field and value
 * @param array: to filter
 * @param fieldPath: to filter by field
 * @param nopStr: filter case; <=, ==, >=, >, array-contains
 * @param value: to filter value
 */
export const getArrayWhereByField = (array: Array<any>, fieldPath: string, nopStr: string, value: any): Array<any> => {
    const tData: Array<any> = [];
    array.forEach(item => {
        if (nopStr === '<' && item[fieldPath] < value) {
            tData.push(item);
        } else if (nopStr === '<=' && item[fieldPath] <= value) {
            tData.push(item);
        } else if (nopStr === '==' && item[fieldPath] === value) {
            tData.push(item);
        } else if (nopStr === '>=' && item[fieldPath] >= value) {
            tData.push(item);
        } else if (nopStr === '>' && item[fieldPath] > value) {
            tData.push(item);
        } else if (nopStr === 'array-contains' && item[fieldPath].includes(value)) {
            tData.push(item);
        }
    });

    return tData;
};

/**
 * get random key
 * @param length: length of key
 */
export const getRandomKey = (length = 16): string => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};
