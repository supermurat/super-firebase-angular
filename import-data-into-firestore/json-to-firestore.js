const admin = require('./node_modules/firebase-admin');
const serviceAccount = require("./supermurat-com-service-key.json");

const data = require("./data.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://supermurat-com.firebaseio.com"
});
admin.app().firestore().settings({timestampsInSnapshots: true});

function fixTimestamps(nestedData){
    if (typeof nestedData === "string") {
        if (nestedData.match(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])[ T](00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\.\d\d\d[Z]?$/gi)) {
            nestedData = new Date(nestedData);
        }
    } else if (typeof nestedData === "object" && nestedData !== undefined && nestedData !== null) {
        Object.keys(nestedData).forEach(key => {
            nestedData[key] = fixTimestamps(nestedData[key]);
        });
    }
    return nestedData;
}

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    if (typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docID => {
            const nestedData = fixTimestamps(nestedContent[docID]);
            // console.log("nestedData:", nestedData);
            admin.firestore()
                .collection(key)
                .doc(docID)
                .set(nestedData)
                .then((res) => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
});
