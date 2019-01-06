# super-firebase-angular / migrate-to-firebase
  - Import your data directly to Cloud Firestore

  - Upload your files directly to Firebase Storage

  - Fix file/image paths on your json data
(in html, just before import) for web projects

## Install dependencies
```sh
npm run install
```

## Export Data
[`./README-EXPORT.md`](./README-EXPORT.md)

## Setup
### Create Service Account
Service Account Name: data-transfer  
User Role: Editor  
[`https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=0&project=supermurat-com`](https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=0&project=supermurat-com)
### Create a new private key
Key Type: JSON  
**DO NOT SHARE your private key!**

### Download private key file and copy to current directory
File Name: supermurat-com-service-key.json  
Relative Path: 
(project root)/migrate-to-firebase/supermurat-com-service-key.json  
**DO NOT COMMIT your key file to GIT!**

### Create Your Own Data
Make a copy of "data-sample.json" file and rename it as "data.json"  
Clean and Edit "data.json" file and save (in "data" directory)  
Check out "data/data-sample.json"  
Data types : [`https://firebase.google.com/docs/firestore/manage-data/data-types`](https://firebase.google.com/docs/firestore/manage-data/data-types)  
JSON Mapping : 
[`https://developers.google.com/protocol-buffers/docs/proto3#json`](https://developers.google.com/protocol-buffers/docs/proto3#json)

## Run
**DO NOT RUN unless you are very sure about "data.json"!**  
**!!! Matched collections/documents/fields will be OVERWRITTEN !!!**
```sh
npm run migrate-to-firebase
```

## Thanks

[`https://hackernoon.com/filling-cloud-firestore-with-data-3f67d26bd66e`](https://hackernoon.com/filling-cloud-firestore-with-data-3f67d26bd66e)
