import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-account',
  templateUrl: 'account.html',
  styleUrls: ['account.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Account {
  constructor() {}
}
