import { Component } from '@angular/core';
import { IonHeader, IonContent, IonSearchbar, IonIcon, IonItem,IonButton,IonThumbnail,IonLabel,
  IonList,IonToolbar } from '@ionic/angular/standalone';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  imports: [IonHeader, IonContent, IonSearchbar, IonIcon, IonItem, IonButton, IonThumbnail,IonLabel,
    IonList,IonToolbar]
})
export class Search {
  allPlaces = recommendedPlaces;
  places = recommendedPlaces.slice(0, 3);

  constructor() {}

  onSearchInput(event: any) {
    const query = event.target.value?.toLowerCase() || '';

    if (query.trim().length === 0) {
      this.places = this.allPlaces.slice(0, 3); // default 3
      return;
    }

    this.places = this.allPlaces.filter(place =>
      place.name.toLowerCase().includes(query) ||
      place.country.toLowerCase().includes(query)
    );
  }

}
