import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonList, IonThumbnail, IonLabel, IonIcon, IonButton,IonButtons,IonSearchbar,IonBackButton,ModalController } from '@ionic/angular/standalone';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';

@Component({
  selector: 'app-custom-search',
  templateUrl: './custom-search.page.html',
  styleUrls: ['./custom-search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonList, IonThumbnail, 
    IonLabel, IonIcon, IonButton,IonButtons,IonSearchbar,IonBackButton]
})
export class CustomSearchPage implements OnInit {
  allPlaces = recommendedPlaces;
  places = recommendedPlaces.slice(0, 3);
  selectedPlace: any;
  @Input() fromPage: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
  }

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

  selectPlace(place: any) {
    this.selectedPlace = place;
    this.modalCtrl.dismiss(this.selectedPlace, 'select');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
