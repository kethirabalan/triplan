import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-trips',
  templateUrl: 'trips.html',
  styleUrls: ['trips.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Trips {
  constructor() {}
}
