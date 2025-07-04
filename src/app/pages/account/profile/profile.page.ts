import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton, IonButton,
  IonIcon,IonList,IonItem,IonLabel,IonCard,IonCardHeader,IonCardContent,IonText,IonThumbnail,IonCardSubtitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons, IonBackButton, IonButton, 
    IonIcon,IonList,IonItem,IonLabel,IonCard, IonCardHeader,IonCardContent,IonText, IonThumbnail, IonCardSubtitle,RouterLink]
})
export class ProfilePage implements OnInit {
  user: any;
  constructor(private authService: AuthService) { 
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

}
