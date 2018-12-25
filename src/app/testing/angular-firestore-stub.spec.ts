
import { from } from 'rxjs';

// test data
const tDataBlog: Array<any> = [
    { id: 'first-blog', routePath: '/blog', orderNo: -3,
        title: 'First Blog', content: 'this is good sample', contentSummary: 'this is good',
        created: { seconds: 1544207666 }, changed: { seconds: 1544207666 }},
    { id: 'second-blog', routePath: '/blog', orderNo: -2,
        title: 'Second Blog', content: 'this is better sample',
        created: { seconds: 1544207667 }, changed: { seconds: 1544207666 }},
    { id: 'third-blog', routePath: '/blog', orderNo: -1,
        title: 'Third Blog', content: 'this is the best sample',
        created: { seconds: 1544207668 }, changed: { seconds: 1544207666 }}
];
const tDataArticle: Array<any> = [
    { id: 'first-article', routePath: '/article', orderNo: -3,
        title: 'First article', content: 'this is good sample', contentSummary: 'this is good',
        created: { seconds: 1544207666 }, changed: { seconds: 1544207666 }},
    { id: 'second-article', routePath: '/article', orderNo: -2,
        title: 'Second article', content: 'this is better sample',
        created: { seconds: 1544207667 }, changed: { seconds: 1544207666 }},
    { id: 'third-article', routePath: '/article', orderNo: -1,
        title: 'Third article', content: 'this is the best sample',
        created: { seconds: 1544207668 }, changed: { seconds: 1544207666 }}
];
const tDataTaxonomy: Array<any> = [
    { id: 'first-tag', routePath: '/tag', orderNo: -3,
        title: 'First tag',
        created: { seconds: 1544207666 }},
    { id: 'second-tag', routePath: '/tag', orderNo: -2,
        title: 'Second tag',
        created: { seconds: 1544207667 }},
    { id: 'third-tag', routePath: '/tag', orderNo: -1,
        title: 'Third tag',
        created: { seconds: 1544207668 }}
];

// test data snap
const tDataSnapBlog: Array<any> = [];
tDataBlog.forEach(value => {
    tDataSnapBlog.push({
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
const tDataSnapArticle: Array<any> = [];
tDataArticle.forEach(value => {
    tDataSnapArticle.push({
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
const tDataSnapTaxonomy: Array<any> = [];
tDataTaxonomy.forEach(value => {
    tDataSnapTaxonomy.push({
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

export const angularFirestoreStub = {
    doc(path: string): any {
        let tData: Array<any>;
        let tDataSnap: Array<any>;
        if (path.startsWith('articles_')) {
            tData = tDataArticle;
            tDataSnap = tDataSnapArticle;
        } else if (path.startsWith('blogs_')) {
            tData = tDataBlog;
            tDataSnap = tDataSnapBlog;
        } else if (path.startsWith('taxonomy_')) {
            tData = tDataTaxonomy;
            tDataSnap = tDataSnapTaxonomy;
        }

        return {
            valueChanges(): any {
                return from([tData[0]]);
            }
        };
    },
    collection(path: string, queryFn?: any): any {
        let fieldPath: string;
        let limitNumber: number;
        let startAfterDoc: any;
        let tData: Array<any>;
        let tDataSnap: Array<any>;
        if (path.startsWith('articles_')) {
            tData = tDataArticle;
            tDataSnap = tDataSnapArticle;
        } else if (path.startsWith('blogs_')) {
            tData = tDataBlog;
            tDataSnap = tDataSnapBlog;
        } else if (path.startsWith('taxonomy_')) {
            tData = tDataTaxonomy;
            tDataSnap = tDataSnapTaxonomy;
        }

        queryFn({
            orderBy(fp): any {
                fieldPath = fp;

                return {
                    limit(ln): any {
                        limitNumber = ln;

                        return {
                            startAfter(sad): any {
                                startAfterDoc = sad;

                                return {
                                    snapshotChanges(): any {
                                        return from([tDataSnap]);
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                return from([tDataSnap]);
                            }};
                    },
                    startAt(sat): any {
                        return {
                            limit(size): any {
                                return {fieldPath};
                            }
                        };
                    }
                };
            },
            where(fp, opStr, value): any {
                fieldPath = fp;

                return {
                    limit(ln): any {
                        limitNumber = ln;

                        return {
                            startAfter(sad): any {
                                startAfterDoc = sad;

                                return {
                                    snapshotChanges(): any {
                                        return from([tDataSnap]);
                                    }
                                };
                            },
                            snapshotChanges(): any {
                                return from([tDataSnap]);
                            }};
                    }
                };
            }
        });

        return {
            valueChanges(): any {
                return from([tData]);
            },
            snapshotChanges(): any {
                return {
                    pipe(queryFnPipe?: any): any {
                        queryFnPipe({
                            lift(queryFnLift?: any): any {
                                queryFnLift.call({}, {
                                    subscribe(queryFnSubscribe): any {
                                        queryFnSubscribe._next({
                                            map(queryFnMap): any {
                                                let startAfterIndex = 0;
                                                if (startAfterDoc)
                                                    if (startAfterDoc.id === tData[0].id)
                                                        startAfterIndex = 1;
                                                    else if (startAfterDoc.id === tData[1].id)
                                                        startAfterIndex = 2;
                                                    else if (startAfterDoc.id === tData[2].id)
                                                        startAfterIndex = 3;

                                                const retVal = [];
                                                if (limitNumber === undefined ||
                                                    (limitNumber > 0 && startAfterIndex < tDataSnap.length))
                                                    retVal.push(queryFnMap(tDataSnap[startAfterIndex]));
                                                if (limitNumber === undefined ||
                                                    (limitNumber > 1 && startAfterIndex + 1 < tDataSnap.length))
                                                    retVal.push(queryFnMap(tDataSnap[startAfterIndex + 1]));
                                                if (limitNumber === undefined ||
                                                    (limitNumber > 2 && startAfterIndex + 2 < tDataSnap.length))
                                                    retVal.push(queryFnMap(tDataSnap[startAfterIndex + 2]));

                                                return retVal;
                                            }
                                        });
                                    }
                                });

                                return from([tDataSnap]);
                            }
                        });

                        return from([tData]);
                    },
                    subscribe(queryFnSubscribe): any {
                        const retVal: Array<any> = [];
                        let startAfterIndex = 0;
                        if (startAfterDoc)
                            if (startAfterDoc.id === tData[0].id)
                                startAfterIndex = 1;
                            else if (startAfterDoc.id === tData[1].id)
                                startAfterIndex = 2;
                            else if (startAfterDoc.id === tData[2].id)
                                startAfterIndex = 3;

                        if (limitNumber === undefined ||
                            (limitNumber > 0 && startAfterIndex < tDataSnap.length))
                            retVal.push(tDataSnap[startAfterIndex]);
                        if (limitNumber === undefined ||
                            (limitNumber > 1 && startAfterIndex + 1 < tDataSnap.length))
                            retVal.push(tDataSnap[startAfterIndex + 1]);
                        if (limitNumber === undefined ||
                            (limitNumber > 2 && startAfterIndex + 2 < tDataSnap.length))
                            retVal.push(tDataSnap[startAfterIndex + 2]);

                        queryFnSubscribe(retVal);

                        return from([tDataSnap]);
                    }
                };
            }
        };
    }
};
