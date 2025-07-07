// import { Injectable } from '@angular/core';
// import { FirebaseRemoteConfig } from '@capacitor-firebase/remote-config';
// import { RemoteConfigs } from '../core/enums';
// import {
//   Observable,
//   Subject,
//   fromEventPattern,
//   map,
//   mergeMap,
//   startWith,
//   tap,
// } from 'rxjs';
// import { asyncForEach } from '../core/utils';
// import { Platform } from '@ionic/angular';
// import { Capacitor } from '@capacitor/core';

// const keys = [
//   'offer_doc_ref',
//   'feature_sos',
//   'feature_billing',
//   'feature_voice_observation',
//   'feature_feces',
//   'feature_video_observation',
//   'feature_diet',
//   'feature_heat_cycle',
//   'feature_travel',
// ] as const;
// type RemoteConfigKey = (typeof keys)[number];

// interface RemoteConfig {
//   key: RemoteConfigKey;
//   value: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class FirebaseRemoteConfigService {
//   constructor(
//   ) { }

//   remoteConfig$: Observable<RemoteConfig[]>;
//   async initialize() {
//     try {
//       await FirebaseRemoteConfig.fetchConfig({
//         minimumFetchIntervalInSeconds: 43200, // 12hrs
//       });
//       if (!Capacitor.isNativePlatform()) {
//         await FirebaseRemoteConfig.setMinimumFetchInterval({
//           minimumFetchIntervalInSeconds: 1200
//         })
//         this.remoteConfig$ = new Subject<RemoteConfig>().asObservable().pipe(
//           startWith({ updatedKeys: keys }),
//           map((value: any) => value.updatedKeys),
//           mergeMap((keys: any[]) => {
//             return this.getConfigs(keys);
//           })
//         );
//       } else {
//         this.remoteConfig$ = fromEventPattern<RemoteConfig[]>(
//           (handler) => FirebaseRemoteConfig.addConfigUpdateListener(handler),
//           (handler, token) =>
//             FirebaseRemoteConfig.removeConfigUpdateListener({ id: token })
//         ).pipe(
//           startWith({ updatedKeys: keys }),
//           map((value: any) => value.updatedKeys),
//           mergeMap((keys: any[]) => {
//             return this.getConfigs(keys);
//           })
//         );
//       }
//     } catch (error) {
//     }
//   }

//   async getConfigs(keys: string[]) {
//     await FirebaseRemoteConfig.fetchAndActivate();
//     const configs: RemoteConfig[] = [];
//     await asyncForEach(keys, async (key: string) => {
//       const result = await FirebaseRemoteConfig.getString({ key });
//       configs.push({ key: key, value: result.value } as RemoteConfig);
//     });
//     return configs;
//   }

//   async getIfAnyOffer() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.OfferDocRef,
//     });
//   }

//   async getFeatureSOS() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureSOS,
//     });
//   }

//   async getFeatureDiet() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureDiet,
//     });
//   }

//   async getFeatureBilling() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureBilling,
//     });
//   }

//   async getFeatureTravel() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureTravel,
//     });
//   }

//   async getFeatureVoiceObservation() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureVoiceObservation,
//     });
//   }

//   async getFeatureFaces() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureFaces,
//     });
//   }

//   async getFeatureVideoObservation() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureVideoObservation,
//     });
//   }
//   async getFeatureHeatCycle() {
//     return await FirebaseRemoteConfig.getString({
//       key: RemoteConfigs.FeatureHeatCycle,
//     });
//   }
// }
