import { Component } from '@angular/core';
import { IonHeader, IonContent, IonSearchbar, IonIcon, IonItem,IonButton,IonThumbnail,IonLabel,IonList } from '@ionic/angular/standalone';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  imports: [IonHeader, IonContent, IonSearchbar, IonIcon, IonItem, IonButton, IonThumbnail,IonLabel,IonList]
})
export class Search {

  places = recommendedPlaces.slice(0, 3);

  constructor() {}

}
