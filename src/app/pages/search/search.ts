import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonIcon, IonList, IonItem,IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  imports: [IonHeader, IonContent, IonSearchbar, IonIcon, IonList, IonItem, IonButton]
})
export class Search {

  constructor() {}

}
