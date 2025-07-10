import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonText, IonGrid, IonRow, IonCol, ModalController, AlertController  } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, radioButtonOnOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LoadingService } from 'src/app/services/loading.service';
import { firstValueFrom } from 'rxjs';
import { SignPage } from 'src/app/modals/sign/sign.page';


@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, IonText, IonGrid, IonRow, IonCol, SignPage]
})
export class OnboardPage implements OnInit {
  isModalOpen = false;
  constructor(private authService: AuthService, private router: Router,private userService: UserService,private loadingService: 
    LoadingService,private modalCtrl: ModalController,private alertController: AlertController) {
    addIcons({
      radioButtonOnOutline,
      logoGoogle
    })
   }

  ngOnInit() {
  }

  async googleSignIn() {
    try {
      const loader = await this.loadingService.show();
      
      await this.authService.signInWithGoogle();
  
      // Get the current user from AuthService
      const currentUser = await firstValueFrom(this.authService.currentUser$);
  
      // Save/update user in Firestore
      const loginMethodToken = await this.authService.getIdToken();

      await this.userService.createOrUpdateUser('Google', {
        moreUserData: {
          loginMethod: 'Google',
          loginMethodId: currentUser?.uid || null,
          loginMethodType: 'Google',
          loginMethodToken,
          loginMethodRefreshToken: null,
        }
      }, currentUser);
  
      await this.loadingService.dismiss(loader);
      this.router.navigate(['/main/tabs/home']).then(() => {
        // Navigation completed successfully
      }).catch(err => {
        console.error('Navigation to home failed:', err);
      });
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      await this.loadingService.dismissAll();
    }
  }

  skip() {
    this.router.navigate(['/main/tabs/home']).then(() => {
      // Navigation completed successfully
    }).catch(err => {
      console.error('Navigation failed:', err);
    });
  }
  
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
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

}
