import { myData } from './data.spec';

/**
 * get snap of data
 * @param tData: to get snap of it
 */
export function getFirestoreSnap(tData: Array<any>): Array<any> {
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
}

/**
 * get data from json test data by field path
 * @param path: to get data of it
 */
export function getDataByPath(path: string): Array<any> {
    const tData: Array<any> = [];
    Object.keys(myData)
        .forEach((prop: string) => {
            if (path.startsWith(prop))
                Object.keys(myData[prop])
                    .forEach((subProp: string) => {
                        tData.push(myData[prop][subProp]);
                    });
        });

    return tData;
}

/**
 * get snap of data from json test data by field path
 * @param tData: to get snap data of it
 */
export function getFirestoreSnapByPath(path: string): Array<any> {
    return getFirestoreSnap(getDataByPath(path));
}

/**
 * get sorted array by number key
 * @param array: to sort
 * @param key: to sort by
 */
export function getSortedArrayByNumberKey(array: Array<any>, key: string): Array<any> {
    return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

/**
 * get array start after by document
 * @param array: to filter
 * @param doc: to start after by
 */
export function getArrayStartAfterByDocument(array: Array<any>, doc: any): Array<any> {
    let startAfterIndex = 0;
    for (let i = 0; i < array.length; i++)
        if (doc.id === array[i].id)
            startAfterIndex = i + 1;

    return array.slice(startAfterIndex);
}

/**
 * get array start by number field path
 * @param array: to filter
 * @param fieldPath: to start by field
 * @param startValue: to start value
 */
export function getArrayStartByNumberField(array: Array<any>, fieldPath: string, startValue: number): Array<any> {
    const tData: Array<any> = [];
    array.forEach(item => {
        if (item[fieldPath] >= startValue)
            tData.push(item);
    });

    return tData;
}

/*  */
/**
 * get filtered array by field and value
 * @param array: to filter
 * @param fieldPath: to filter by field
 * @param nopStr: filter case; <=, ==, >=, >, array-contains
 * @param value: to filter value
 */
export function getArrayWhereByField(array: Array<any>, fieldPath: string, nopStr: string, value: any): Array<any> {
    const tData: Array<any> = [];
    array.forEach(item => {
        if (nopStr === '<' && item[fieldPath] < value)
            tData.push(item);
        else if (nopStr === '<=' && item[fieldPath] <= value)
            tData.push(item);
        else if (nopStr === '==' && item[fieldPath] === value)
            tData.push(item);
        else if (nopStr === '>=' && item[fieldPath] >= value)
            tData.push(item);
        else if (nopStr === '>' && item[fieldPath] > value)
            tData.push(item);
        else if (nopStr === 'array-contains' && item[fieldPath].includes(value))
            tData.push(item);
    });

    return tData;
}
