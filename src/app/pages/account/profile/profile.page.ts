import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton, IonButton,
  IonIcon,IonList,IonItem,IonLabel,IonCard,IonCardHeader,IonCardContent,IonText,IonThumbnail,IonCardSubtitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CldImgPipe } from 'src/app/pipes/cld-img.pipe';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons, IonBackButton, IonButton, 
    IonIcon,IonList,IonItem,IonLabel,IonCard, IonCardHeader,IonCardContent,IonText, IonThumbnail, IonCardSubtitle,RouterLink, CldImgPipe]
})
export class ProfilePage implements OnInit {
  currentUser: any;
  userData: any;
  constructor(private authService: AuthService, private userService: UserService) {   
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  async ngOnInit() {
    try {
      
      // Get current authenticated user
      this.currentUser = await firstValueFrom(this.authService.currentUser$);
      
      if (this.currentUser) {
        // Get user data from Firestore
        this.userData = await this.userService.getUser(this.currentUser.uid);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

}
