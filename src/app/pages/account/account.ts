import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonListHeader,IonLabel,IonItem,IonList, IonAvatar, IonIcon,IonNote,IonButton,ModalController } from '@ionic/angular/standalone';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Device } from '@capacitor/device';
import { AppInfo } from 'src/app/core/interfaces';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { BookingsPage } from 'src/app/modals/bookings/bookings.page';
import { NotificationsPage } from 'src/app/modals/notifications/notifications.page';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.html',
  styleUrls: ['account.scss'],
  providers: [AppVersion,ModalController],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, 
    IonListHeader,IonAvatar,IonIcon, IonNote, RouterLink,IonButton,CommonModule],
})
export class Account  implements OnInit{
  isNative: boolean = false;
  appInfo: AppInfo = {
    version: '',
    build: '',
    deviceId: ''
  };
  user: any;
  constructor(private appVersionPlugin: AppVersion,private alertController: AlertController,
    private modalCtrl: ModalController,private authService: AuthService,private router: Router) {
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

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/onboard-welcome']);
  }
}
