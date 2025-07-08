import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonListHeader, IonLabel, IonItem, IonList, IonAvatar,
  IonIcon, IonNote, IonButton, ModalController, IonModal, IonButtons, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Device } from '@capacitor/device';
import { AppInfo } from 'src/app/core/interfaces';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { BookingsPage } from 'src/app/modals/bookings/bookings.page';
import { NotificationsPage } from 'src/app/modals/notifications/notifications.page';
import { AuthService } from 'src/app/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SignPage } from 'src/app/modals/sign/sign.page';

@Component({
  selector: 'app-account',
  templateUrl: 'account.html',
  styleUrls: ['account.scss'],
  providers: [AppVersion, ModalController],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonListHeader, IonAvatar, IonIcon, IonNote, RouterLink, IonButton, CommonModule, IonModal, IonButtons, IonInput, ReactiveFormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class Account implements OnInit {
  appInfo: AppInfo = {
    version: '',
    build: '',
    deviceId: ''
  };
  user: any;
  isModalOpen = false;
  showSignInForm = false;
  email: string = '';
  password: string = '';
  isNative: any;
  constructor(private appVersionPlugin: AppVersion, private alertController: AlertController,
    private modalCtrl: ModalController, private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  async ngOnInit() {
    this.isNative = Capacitor.isNativePlatform();
    if (this.isNative) {
      try {
        this.appInfo.version = await this.appVersionPlugin.getVersionNumber();
        this.appInfo.build = await this.appVersionPlugin.getVersionCode();

        const info = await Device.getId();
        this.appInfo.deviceId = info.identifier ?? '';
      } catch (err) {
        console.warn('Error fetching native info:', err);
      }
    }
  }

  async openNotificationsModal() {
    const modal = await this.modalCtrl.create({
      component: NotificationsPage,
    });
    await modal.present();
  }

  async openBookingsModal() {
    const modal = await this.modalCtrl.create({
      component: BookingsPage,
    });
    await modal.present();
  }

  async presentSignOutAlert() {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Sign Out',
          role: 'destructive',
          cssClass: 'white-button',
          handler: () => {
            this.signOut();
          },
        },
      ],
    });

    await alert.present();
  }

  dismissModal() {
    this.isModalOpen = false;
  }

  async signInWithGoogle() {
    this.authService.signInWithGoogle();
    this.isModalOpen = false;
  }

  async createAccount() {
    const modal = await this.modalCtrl.create({
      component: SignPage,
      componentProps: {
        isSignIn: false,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    this.isModalOpen = false;
    if (role === 'createAccount') {
      this.authService.signUpWithEmailAndPassword(data.email, data.password).then(() => {
        this.authService.sendEmailVerification();
      }).catch((error) => {
        this.presentAlert('Error creating account');
      });
    }
    if (role === 'signIn') {
      this.authService.signInWithEmailAndPassword(data.email, data.password);
    }
    if (role === 'emailVerificationSent') {
      this.presentAlert('Email verification sent');
    } else if (role === 'emailVerificationError') {
      this.presentAlert('Error sending email verification');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async signIn() {
    const modal = await this.modalCtrl.create({
      component: SignPage,
      componentProps: {
        isSignIn: true,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    this.isModalOpen = false;
    if (role === 'signIn') {
      this.authService.signInWithEmailAndPassword(data.email, data.password);
    }
  }

  async signOut() {
    this.user = null;
    await this.authService.signOut();
    await this.router.navigate(['/onboard-welcome']);
  }
}
