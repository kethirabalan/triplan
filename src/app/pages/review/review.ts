import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-review',
  templateUrl: 'review.html',
  styleUrls: ['review.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Review {
  constructor() {}
}
