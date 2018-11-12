# super-firebase-angular / import-data-into-firestore
Import your data directly to Cloud Firestore.

## Install dependencies
```sh
npm run install
```

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
Relative Path: (project root)/import-data-into-firestore/supermurat-com-service-key.json  
**DO NOT COMMIT your key file to GIT!**

### Edit Data
Edit data.json file and save

## Run
**DO NOT RUN unless you are very sure about data.json!**  
**!!! Matched collections/documents/fields will be OVERWRITTEN !!!**
```sh
npm run json-to-firestore
```

## Thanks

[`https://hackernoon.com/filling-cloud-firestore-with-data-3f67d26bd66e`](https://hackernoon.com/filling-cloud-firestore-with-data-3f67d26bd66e)
