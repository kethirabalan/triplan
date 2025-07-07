import { Component } from '@angular/core';
import { IonHeader, IonContent, IonSearchbar, IonIcon, IonItem,IonButton,IonThumbnail,IonLabel,
  IonList,IonToolbar,IonBackButton,IonButtons } from '@ionic/angular/standalone';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  imports: [IonHeader, IonContent, IonSearchbar, IonIcon, IonItem, IonButton, IonThumbnail,IonLabel,
    IonList,IonToolbar,IonBackButton,IonButtons]
})
export class Search {
  allPlaces = recommendedPlaces;
  places = recommendedPlaces.slice(0, 3);

  constructor(private router: Router) {}

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

  goToPlace(place: any) {
    this.router.navigate(['/tabs/home/view-recommendation'], { state: { item: place} });
  }

}
