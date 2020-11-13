# Mastermock: Angular Serverless Development

Mastermock was a tool designed to help develop angular applications without the need of a live server.
This is accomplished without the need of spinning up a dummy server or bloating the production build.

## Version 3 Upgrade

Because of how angular is now compiled you will need a tsconfig.mock file to include the dev files and the main-mock file.

```json
 "files": [
   ...
    "main-mock.ts",
  ],
  "include": [
   ...
    "**/*.dev.ts"
  ]
```

That will need to be added to your configuration in the angular.json config

```json
 "main": "src/main-mock.ts",
  "tsConfig": "src/tsconfig.mock.json"
```

## Setup

* Grab the [main-mock.ts](https://github.com/lbdorrou/ngx-mastermock/blob/master/src/main-mock.ts) file and place it in the project next to the **main.ts** file generated by the Angular CLI

* Inside of the **angular.json** config add the following master mock configurations to the build and serve architect steps

```json
"architect": {
  "build": {
    "configurations": {
      "mastermock": {
        "main": "src/main-mock.ts"
      }
    }
  },
  "serve": {
    "configurations": {
      "mastermock": {
        "browserTarget": "ngx-mastermock-app:build:mastermock"
      }
    }
  }
}

```

* Add the interceptor into the app.module

```typescript

// Import
import { MastermockInterceptor } from 'ngx-mastermock';

// Provider
providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MastermockInterceptor,
      multi: true
    }
  ]
```

*The app is now ready to run with mock data*

## Use

To use the mock data framework create files in the project with a **.dev.ts** extension.

Usually these will have the same name as the service being mocked and live next to it in the folder structure.

Once that is created use the skeleton below to build out the mock data

```typescript
import { HttpResponse } from '@angular/common/http';

import { Mastermock } from 'ngx-mastermock/ngx-mastermock';
import { MastermockResponse } from 'ngx-mastermock/ngx-mastermock';

export default class implements Mastermock {

    public registerEndpoints() {
        return {
            '/endpoint/my/service/calls': this.exampleData
        };
    }


    public exampleData(): MastermockResponse {
        return {
            response: new HttpResponse({
                status: 200,
                body: { 
                    data: 'ThisIsData'
                }
            })
        };
    }
}
```

Run **ng serve --configuration mastermock** and the mock data will be picked up and used instead of a live server

## Why does this exist?

Our team found it difficult to work as fast as we would like to when server stability was a problem. 

We also didn't like other solutions that would take longer to set up and didn't take advantage of the interfaces already built into the frontend.

