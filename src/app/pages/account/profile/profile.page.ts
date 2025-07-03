import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton, IonButton,
  IonIcon,IonAvatar,IonList,IonItem,IonLabel,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonText,IonThumbnail } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons, IonBackButton, IonButton, 
    IonIcon,IonAvatar,IonList,IonItem,IonLabel,IonCard, IonCardHeader, IonCardTitle,IonCardContent,IonText, IonThumbnail]
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
