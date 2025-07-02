import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonListHeader,IonLabel,IonItem,IonList, IonAvatar, IonIcon,IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-account',
  templateUrl: 'account.html',
  styleUrls: ['account.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, 
    IonListHeader,IonAvatar,IonIcon, IonNote, RouterLink],
})
export class Account {
  constructor() {}
}
