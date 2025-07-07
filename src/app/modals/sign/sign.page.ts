import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonInput, IonItem, IonButton, IonButtons, IonList, IonListHeader, IonLabel, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.page.html',
  styleUrls: ['./sign.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonItem, IonButton, IonButtons, IonList, IonListHeader, IonLabel, IonIcon, ReactiveFormsModule]
})
export class SignPage implements OnInit {
  @Input() isSignIn: boolean = false;
  email: string = '';
  password: string = '';
  modalForm: FormGroup;
  constructor(private modalCtrl: ModalController, private authService: AuthService, private alertController: AlertController) { 
    addIcons({
      closeOutline
    })
    this.modalForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    console.log(this.isSignIn);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async signIn() {
    if (this.modalForm.invalid) {
      await this.presentAlert('Please enter a valid email and password');
      return;
    }
    return this.modalCtrl.dismiss({
      email: this.modalForm.get('email')?.value,
      password: this.modalForm.get('password')?.value
    }, 'signIn');
  }

  async createAccount() {
    console.log(this.modalForm.value);
    if (this.modalForm.invalid) {
      await this.presentAlert('Please enter a valid email and password');
      return;
    }
    return this.modalCtrl.dismiss({
      email: this.modalForm.get('email')?.value,
      password: this.modalForm.get('password')?.value
    }, 'createAccount');
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then(() => {
      this.modalCtrl.dismiss(null, 'signInWithGoogle');
    }).catch((error) => {
      this.modalCtrl.dismiss(null, 'signInWithGoogleError');
    });
  }

  forgotPassword() {
    this.isSignIn = true;
    this.authService.sendEmailVerification().then(() => {
      this.modalCtrl.dismiss(null, 'emailVerificationSent');
    }).catch((error) => {
      this.modalCtrl.dismiss(null, 'emailVerificationError');
    });
  }

  dismissModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
