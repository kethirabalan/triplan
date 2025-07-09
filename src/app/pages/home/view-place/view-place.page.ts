import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSpinner, IonList, IonItem, IonLabel, IonNote, IonBackButton, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';
import { recommendedPlaces as staticRecommended } from 'src/app/data/recommendedPlaces';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-view-place',
  templateUrl: './view-place.page.html',
  styleUrls: ['./view-place.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton,IonIcon,IonSpinner,IonList,IonItem,IonLabel,IonNote,IonBackButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewPlacePage implements OnInit {
  isFavorite = false;
  place: any = null;
  images: string[] = [];
  loading = true;
  recommendedPlaces: any[] = staticRecommended;

  constructor(
    private router: Router,
    private gemini: GeminiService,
    private pixabay: PixabayService,
    private toast: ToastController
  ) { }

  async ngOnInit() {
    let place = window.history.state.item;
    this.loading = true;
    if (place) {
      // Get a random spot from Gemini
      try {
        const places = await this.gemini.getPlaceDetails(place);
        place = places[Math.floor(Math.random() * places.length)];
      } catch (error) {
        console.error('Error getting global places:', error);
        this.toast.create({
          message: 'Error getting global places so using recommended places',
          duration: 2000,
          color: 'danger'
        });
        place = this.recommendedPlaces[Math.floor(Math.random() * this.recommendedPlaces.length)];
      }
      this.place = place;
      this.loading = false;
    }
    // Fetch images from Pixabay
    this.pixabay.searchImage(place.image_query || place.location).subscribe(result => {
      this.images = (result?.hits || []).map((img: any) => img.largeImageURL);
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  sharePlace() {
    const shareData = {
      title: this.place.name,
      text: this.place.shortDesc,
      url: window.location.href
    };
  
    // Check if running on a device (native)
    if ((window as any).Capacitor?.isNativePlatform()) {
      Share.share(shareData).catch(err => {
        console.error('Native share failed:', err);
      });
    } else if (navigator.share) {
      // Web share
      navigator.share(shareData).catch(err => {
        console.error('Web share failed:', err);
      });
    } else {
      // Fallback if no share supported
      this.toast.create({
        message: 'Sharing is not supported on this platform.',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  favoritePlace() {
    this.isFavorite = !this.isFavorite;
    if(this.isFavorite) {
      this.place.isFavorite = true;
    } else {
      this.place.isFavorite = false;
    }
  }
}