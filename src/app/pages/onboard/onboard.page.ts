import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonText, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, radioButtonOnOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, IonText, IonGrid, IonRow, IonCol]
})
export class OnboardPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      radioButtonOnOutline,
      logoGoogle
    })
   }

  ngOnInit() {
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then((user) => {
      this.router.navigate(['/home']);
    });
  }

  signIn() {
    this.router.navigate(['/signin']);
  }

}
