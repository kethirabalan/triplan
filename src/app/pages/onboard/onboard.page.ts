import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonText, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, radioButtonOnOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LoadingService } from 'src/app/services/loading.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, IonText, IonGrid, IonRow, IonCol]
})
export class OnboardPage implements OnInit {
  constructor(private authService: AuthService, private router: Router,private userService: UserService,private loadingService: LoadingService) {
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
      this.router.navigate(['/tabs/home']).then(() => {
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
    this.router.navigate(['/tabs/home']).then(() => {
      // Navigation completed successfully
    }).catch(err => {
      console.error('Navigation failed:', err);
    });
  }

  signIn() {
    this.router.navigate(['/tabs/signin']);
  }

}
