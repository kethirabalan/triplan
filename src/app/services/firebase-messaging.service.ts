import { Injectable, NgZone } from '@angular/core';
import { FirebaseMessaging, GetTokenOptions } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { environment } from '../../environments/environment';
import { FirebaseFirestoreService } from './firebase-firestore.service';
import { NotificationType, PreferencesKey } from '../core/enums';
import { Globals } from "../core/global";
import { EpisodesPage } from '../pages/episodes/episodes.page';
import { ModalBasePage } from '../modals/modal-base/modal-base.page';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';
// import { TranscribeSummaryPage } from '../pages/transcribe-summary/transcribe-summary.page';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { ViewMessagePage } from '../pages/view-message/view-message.page';
import { LogWeightPage } from '../pages/log-weight/log-weight.page';
import { BadgeNotificationService } from './badge-notification.service';
// import { PreferencesStorageService } from './preferences-storage.service';
import { CloudFunctionService } from './cloud-function.service';
import { AuthService } from './auth.service';
import { KompisService } from './kompis.service';
import { MedicationTakenModalPage } from '../modals/medication-taken-modal/medication-taken-modal.page';
import { where } from '@angular/fire/firestore';
import { ProductTakenModalPage } from '../modals/product-taken-modal/product-taken-modal.page';
import { ViewInsuranceComponent } from '../pages/view-insurance/view-insurance.component';
import { ErrorLogService } from './error-log.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {

  current = Globals.current;
  currentlyPlayingPlaylist: any;
  currentlyPlayingEpisode: any;
  notificationData: any;
  notificationDenied: boolean = false;

  constructor(
    private readonly ngZone: NgZone,
    private readonly firestoreService: FirebaseFirestoreService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private badgeNotificationService: BadgeNotificationService,
    private authService: AuthService,
    // private preferencesStorageService: PreferencesStorageService,
    private cloudFunctionService: CloudFunctionService,
    private kompisService: KompisService,
    private errorLogService: ErrorLogService
  ) { }

  async initialize() {
    if (!this.current.authUser) {
      this.current.authUser = await this.authService.getCurrentAuthUser();
    }
    if (this.current.authUser && !this.current.user) {
      this.current.user = await this.firestoreService.getDocData(`users/${this.current.authUser.uid}`);
    }
    FirebaseMessaging.removeAllListeners().then(() => {
      FirebaseMessaging.addListener('tokenReceived', (event) => {
        this.ngZone.run(() => {
          this.updateToken(event.token);
        });
      });
      FirebaseMessaging.addListener('notificationReceived', async (event) => {
        this.notificationData = event.notification.data;
        if (this.notificationData?.type === NotificationType.NewEpisode ||
          this.notificationData?.type === NotificationType.NewEmail || this.notificationData?.type === NotificationType.Medication) {
          await this.badgeNotificationService.increaseBadge();
        }
      });
      FirebaseMessaging.addListener('notificationActionPerformed', (event: any) => {
        this.modalToOpen(event.notification.data);
      });
    });
    if (Capacitor.getPlatform() === "web") {
      navigator.serviceWorker.addEventListener('message', (event: any) => {
        const notification = new Notification(event.data.notification.title, {
          body: event.data.notification.body,
        });
        notification.onclick = (event: any) => {
          this.modalToOpen(this.notificationData)
        };

      });
    }
  }

  async modalToOpen(data: any) {
    if (this.current.authUser && this.current.user && data.animalId) {
      // this.current.alc = await this.preferencesStorageService.getALC();
      if (!this.current.alc || (this.current.alc && this.current.alc.selectedPetId !== data.animalId)) {
        await Preferences.set({ key: PreferencesKey.selectedPetId, value: data.animalId });
        if (this.current.alc) {
          this.current.alc.selectedPetId = data.animalId;
        } else {
          this.current.alc = {
            selectedPetId: data.animalId
          }
        }
      }
    }
    if (data.type === NotificationType.NewEpisode) {
      this.navCtrl.navigateRoot(`/pets/${data.animalId}`);
      const modal = await this.modalCtrl.create({
        mode: Capacitor.getPlatform() === 'android' ? 'md' : 'ios',
        component: ModalBasePage,
        componentProps: {
          rootPage: EpisodesPage,
          rootParams: {
            playlistIds: [data.currentPlaylistId],
            currentPlaylistId: data.currentPlaylistId,
            currentCaregiverId: data.currentCaregiverId
          }
        }
      });
      await modal.present();
      // await modal.onWillDismiss().then(() => {
      // this.currentlyPlayingPlaylist = this.audioService.currentlyPlayingPlaylist;
      // this.currentlyPlayingEpisode = this.audioService.currentlyPlayingEpisode;
      // })
      await modal.onDidDismiss().then(() => {
        if (Capacitor.isNativePlatform()) {
          StatusBar.show();
        }
      });
    } else if (data.type === NotificationType.WeightSchedule) {
      await this.navCtrl.navigateRoot(`/pets`);
      const modal = await this.modalCtrl.create({
        mode: Capacitor.getPlatform() === 'android' ? 'md' : 'ios',
        component: ModalBasePage,
        componentProps: {
          rootPage: LogWeightPage,
          rootParams: {
            type: 'modal',
            animalId: data.animalId
          }
        }
      });
      await modal.present();

    } else if (data.type === NotificationType.NewSummary) {

      // const modal = await this.modalCtrl.create({
      //   mode: Capacitor.getPlatform() === 'android' ? 'md' : 'ios',
      //   component: ModalBasePage,
      //   componentProps: {
      //     rootPage: TranscribeSummaryPage,
      //     rootParams: {
      //       summaryPath: data.summaryPath,
      //       observationPath: data.observationPath
      //     }
      //   }
      // });
      // await modal.present();
    } else if (data.type === NotificationType.NewEmail || data.type === NotificationType.InboxImported) {
      this.navCtrl.navigateRoot(`/pets`);
      // this.navCtrl.navigateForward(`/pets/${data.animalId}/status-info/messages/inbox/${data.inboxId}`);
      const modal = await this.modalCtrl.create({
        mode: Capacitor.getPlatform() === 'android' ? 'md' : 'ios',
        component: ModalBasePage,
        componentProps: {
          rootPage: ViewMessagePage,
          rootParams: {
            id: data.animalId,
            msgId: data.inboxId,
            selectedTag: 'inbox',
            selectedAttributeId: 'copy.PvTqsaMkdDDgdiT3bqWZ',
            type: 'modal',
            fromPage: 'messaging'
          }
        }
      });
      await modal.present();
    } else if (data.type === NotificationType.Medication) {
      this.navCtrl.navigateRoot(`/pets/${data.animalId}`);
      const modal = await this.modalCtrl.create({
        mode: Capacitor.getPlatform() === 'android' ? 'md' : 'ios',
        component: ModalBasePage,
        componentProps: {
          rootPage: MedicationTakenModalPage,
          rootParams: {
            type: 'modal',
            fromPage: 'firebase-messaging',
            intakePath: `animals/${data.animalId}/intakeItems/${data.intakeId}`,
            scheduleId: data.scheduleId,
            scheduleDetails: {
              unit: data.unit,
              value: data.value,
              scheduledAt: data.scheduledAt,
              timezone: data.timezone
            }
          }
        }
      });
      await modal.present();
    } else if (data.type === NotificationType.Supplement || data.type === NotificationType.Food || data.type === NotificationType.Treat) {
      this.navCtrl.navigateRoot(`/pets/${data.animalId}`);
      const modal = await this.modalCtrl.create({
        mode: Capacitor.getPlatform() === 'android' ? 'md' : 'ios',
        component: ModalBasePage,
        componentProps: {
          rootPage: ProductTakenModalPage,
          rootParams: {
            type: 'modal',
            fromPage: 'firebase-messaging',
            intakePath: `animals/${data.animalId}/intakeItems/${data.intakeId}`,
            scheduleId: data.scheduleId,
            scheduleDetails: {
              unit: data.unit,
              value: data.value,
              scheduledAt: data.scheduledAt,
              timezone: data.timezone
            }
          }
        }
      });
      await modal.present();
    } else if (data.type === NotificationType.InsuranceRejected) {
      this.navCtrl.navigateRoot(`/pets/${data.animalId}`);
      const modal = await this.modalCtrl.create({
        mode: Capacitor.getPlatform() === 'android' ? 'md' : 'ios',
        component: ModalBasePage,
        componentProps: {
          rootPage: ViewInsuranceComponent,
          rootParams: {
            type: 'modal',
            insuranceId: data.insuranceId,
          }
        }
      });
      await modal.present();
    }
  }

  async checkPermissions() {
    try {
      const permStatus = await FirebaseMessaging.checkPermissions();
      if (permStatus.receive === 'denied') {
        this.notificationDenied = true;
      } else {
        this.notificationDenied = false;
      }
      return permStatus.receive;
    } catch (error) {
      this.kompisService.logError(error);
      this.errorLogService.cloudLogEvent(error, 'FirebaseMessagingService:checkPermissions');
      return 'error';
    }
  };

  async requestPermissions() {
    try {
      if (!this.notificationDenied) {
        const permStatus = await FirebaseMessaging.requestPermissions();
        if (permStatus.receive === 'granted') {
          this.register();
        }
        return permStatus.receive;
      }
      else {
        if (Capacitor.getPlatform() !== "web") {
          this.openDeviceNotificationSettings();
        }
        this.register();
        return '';
      }
    } catch (error) {
      this.kompisService.logError(error);
      this.errorLogService.cloudLogEvent(error, 'FirebaseMessagingService:requestPermissions');
      return 'error';
    }

  };

  async openDeviceNotificationSettings() {
    try {
      await NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App
      });
    } catch (error) {
      this.kompisService.logError(error);
      this.errorLogService.cloudLogEvent(error, 'FirebaseMessagingService:openDeviceNotificationSettings');
    }
  }

  async register() {
    try {
      const options: GetTokenOptions = {
        vapidKey: environment.firebase.vapidKey,
      };
      if (Capacitor.getPlatform() === "web") {
        options.serviceWorkerRegistration =
          await navigator.serviceWorker.register("firebase-messaging-sw.js");
      }
      const { token } = await FirebaseMessaging.getToken(options);
      this.updateToken(token)

    } catch (error) {
      this.kompisService.logError(error);
      this.errorLogService.cloudLogEvent(error, 'FirebaseMessagingService:register');
    }
  }


  async updateToken(token: string) {
    try {
      const deviceId = await Device.getId();
      const existingDevice: any = await this.firestoreService.getDocData(`devices/${deviceId.identifier}`);
      if (!existingDevice) {
        const data: any = {
          fcmToken: token,
        };
        if (this.current.user) {
          data.user = this.firestoreService.getDocRef(this.current.user._meta.path)
        }
        this.firestoreService.setWithMerge(`devices/${deviceId.identifier}`, data);
        // For removing duplicate messages
        let existingFCMToken = await this.firestoreService.getColOnQuery('devices', [where('fcmToken', '==', token)])
        existingFCMToken = existingFCMToken.filter((d: any) => d._meta.id !== deviceId.identifier)
        if (existingFCMToken.length) {
          this.firestoreService.update(existingFCMToken[0]._meta.id, {
            user: null
          });
        }
      } else if (existingDevice && (!existingDevice.fcmToken || existingDevice.fcmToken !== token)) {
        const data: any = {
          fcmToken: token,
          // '_meta.status': DocMetaStatus.Live
        };
        if (this.current.user) {
          data.user = this.firestoreService.getDocRef(this.current.user._meta.path)
        }
        this.firestoreService.update(`devices/${deviceId.identifier}`, data);
      }
    } catch (error) {
      this.kompisService.logError(error);
      this.errorLogService.cloudLogEvent(error, 'FirebaseMessagingService:updateToken');
    }
  }

  async removeAllDeliveredNotifications() {
    await FirebaseMessaging.removeAllDeliveredNotifications();
  }

}

