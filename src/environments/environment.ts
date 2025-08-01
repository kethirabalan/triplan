// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appBaseUrl: 'http://localhost:4200',
  production: false,
  pixabay: {
    key: '43762662-30a9a29aa7cb6eb9177b77fcb'
  },
  geminiApi: {
    key: 'AIzaSyBUoUG6zdV3D0KsEqt-k7Fxh2GaN24ZObY'
  },
  firebase: {
    apiKey: "AIzaSyCcFHNCwPyBS74pEXpw0plifwK87jshjvI",
    authDomain: "triplan-247f3.firebaseapp.com",
    projectId: "triplan-247f3",
    storageBucket: "triplan-247f3.firebasestorage.app",
    messagingSenderId: "686247485632",
    appId: "1:686247485632:web:9f9839bbbd09302d848d25",
    measurementId: "G-6NGH48XTLK"
  },
  // cloudinary: {
  //   cloudName: 'dpnjqev0i',
  //   apiKey: '575631284757631',
  //   apiSecret: 'UxqJk0FKexch-LwU9H654e3zUww'
  // }

  cloudinary: {
    cloudName: 'dpnjqev0i',
    baseUrl: 'https://res.cloudinary.com/dpnjqev0i',
    folder: 'trip-dev',
    uploadPreset: 'upload',
    uploadEndpoint: 'https://api.cloudinary.com/v1_1/dpnjqev0i/auto/upload'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
