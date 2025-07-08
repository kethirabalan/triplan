import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonInput, IonIcon, ModalController, 
  IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonBadge, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardContent, 
  IonCardSubtitle, IonGrid, IonRow, IonCol, IonCardTitle, IonImg, IonThumbnail } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomSearchPage } from 'src/app/modals/custom-search/custom-search.page';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';
import { recommendedPlaces as staticRecommended } from 'src/app/data/recommendedPlaces';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip-view.page.html',
  styleUrls: ['./trip-view.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonModal, 
    IonButton, IonInput, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonIcon, IonBadge,IonButtons,IonBackButton,IonCard,
    IonCardHeader,IonCardContent,IonCardSubtitle,IonGrid,IonRow,IonCol,IonCardTitle,IonImg,TitleCasePipe,IonThumbnail]
})
export class TripViewPage implements OnInit {
  tripName: string = '';
  place: any = null;
  loading = true;
  recommendedPlaces: any[] = staticRecommended;
  places: any[] = [];
  placeImages: { [placeName: string]: string[] } = {};
  constructor(private route: ActivatedRoute, private modalController: ModalController,
    private router: Router,
    private gemini: GeminiService,
    private pixabay: PixabayService,
    private toast: ToastController) { }

    async ngOnInit() { 
      this.tripName = this.route.snapshot.paramMap.get('tripName') || '';
      let place = window.history.state.item;
    
      if (!place) {
        try {
          const places = await this.gemini.getTripPlaces(this.tripName);
          place = places;
        } catch (error) {
          console.error('Error getting global places:', error);
          this.toast.create({
            message: 'Error getting global places so using recommended places',
            duration: 2000,
            color: 'danger'
          });
          place = [this.recommendedPlaces[Math.floor(Math.random() * this.recommendedPlaces.length)]];
        }
      }
    
      this.places = place.slice(0, 3);
      for (const place of this.places) {
        const query = place.image_query || place.name;
        this.pixabay.searchImage(query).subscribe(
          result => {
            const images = (result?.hits || []).map((img: any) => img.largeImageURL);
            this.placeImages[place.name] = images;
          },
          err => {
            console.error(`Error fetching images for ${place.name}`, err);
            this.placeImages[place.name] = []; // Ensure empty array fallback
          }
        );
      }
    }

  async createTrip() {
    const modal = await this.modalController.create({
      component: CustomSearchPage,
      componentProps: {
        fromPage: 'trip-view'
      }
    });
    await modal.present();
  }

  async addPlace(place: any) {
    console.log(place);
  }

  async addSaves(saves: any) {
    console.log(saves);
  }

  async addItinerary(itinerary: any) {
    console.log(itinerary);
  }

  async deleteTrip() {
    console.log('delete trip');
  }

  async editTrip() {
    console.log('edit trip');
  }

  async inviteToTrip() {
    console.log('invite to trip');
  }

  async shareTrip() {
    console.log('share trip');
  }

  async deletePlace(place: any) {
    console.log('delete place');
  }

  async deleteSave(save: any) {
    console.log('delete save');
  }

  async deleteItinerary(itinerary: any) {
    console.log('delete itinerary');
  }

  async deleteAll() {
    console.log('delete all');
  }

  async addPlaceToItinerary(place: any) {
    console.log('add place to itinerary');
  }

  async addSaveToItinerary(save: any) {
    console.log('add save to itinerary');
  }

  async startExploring() {
    console.log('start exploring');
  }



}
