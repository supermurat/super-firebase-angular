# Setup Travis CI

## Environment Variables
If your secret variable has special characters like ```&```, escape them by adding ```\``` in front of each special character. For example, ```m a&w!do$c``` would be entered as ```m\ a\&w\!do\$c```

| Name                               | Value                                  |
| ---                                | ---                                    |
| BROWSERSTACK_ACCESS_KEY:           | ...................................... |
| BROWSERSTACK_USERNAME:             | ...................................... |
| CODACY_PROJECT_TOKEN:              | ...................................... |
| CONFIG_BASE_ANGULARTICS2:          | {gst:{trackingIds:['UA-...-..']}}      |
| CONFIG_BASE_CSE:                   | {cx:'...:...'}                         |
| CONFIG_BASE_FIREBASE:              | {apiKey:'',authDomain:'', ...}         |
| CONFIG_BETA_ANGULARTICS2:          | {gst:{trackingIds:['UA-...-..']}}      |
| CONFIG_BETA_CSE:                   | {cx:'...:...'}                         |
| CONFIG_BETA_FIREBASE:              | {apiKey:'',authDomain:'', ...}         |
| CONFIG_PROD_ANGULARTICS2:          | {gst:{trackingIds:['UA-...-..']}}      |
| CONFIG_PROD_CSE:                   | {cx:'...:...'}                         |
| CONFIG_PROD_FIREBASE:              | {apiKey:'',authDomain:'', ...}         |
| FIREBASE_TOKEN_BETA:               | ...................................... |
| FIREBASE_TOKEN_PROD:               | ...................................... |
