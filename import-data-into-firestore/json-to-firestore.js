const admin = require('./node_modules/firebase-admin');
const serviceAccount = require("./supermurat-com-service-key.json");

const data = require("./data.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://supermurat-com.firebaseio.com"
});

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    if (typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docID => {
            admin.firestore()
                .collection(key)
                .doc(docID)
                .set(nestedContent[docID])
                .then((res) => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
});