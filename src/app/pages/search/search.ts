import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class Search {

  constructor() {}

}
