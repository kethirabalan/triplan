import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSpinner, IonList, IonItem, IonLabel, IonNote, IonBackButton, ToastController, IonChip } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';
import { recommendedPlaces as staticRecommended } from 'src/app/data/recommendedPlaces';
import { Share } from '@capacitor/share';
@Component({
  selector: 'app-view-recommendation',
  templateUrl: './view-recommendation.page.html',
  styleUrls: ['./view-recommendation.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton,IonIcon,IonSpinner,IonList,IonItem,IonLabel,IonNote,IonBackButton,IonChip],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewRecommendationPage implements OnInit {
  isFavorite = false;
  spot: any = null;
  images: string[] = [];
  loading = true;
  recommendedPlaces: any[] = staticRecommended;

  constructor(
    private router: Router,
    private gemini: GeminiService,
    private pixabay: PixabayService,
    private toast: ToastController,
  ) { }

  async ngOnInit() {
    let spot = window.history.state.item;
    this.loading = true;
    if (spot) {
      // Get a random spot from Gemini
      try {
        const spots = await this.gemini.getPlaceDetails(spot);
        spot = spots[Math.floor(Math.random() * spots.length)];
      } catch (error) {
        console.error('Error getting global recommendations:', error);
        this.toast.create({
          message: 'Error getting global recommendations so using recommended places',
          duration: 2000,
          color: 'danger'
        });
        spot = this.recommendedPlaces[Math.floor(Math.random() * this.recommendedPlaces.length)];
      }
      this.spot = spot;
      this.loading = false;
    }
    // Fetch images from Pixabay
    this.pixabay.searchImage(spot.image_query).subscribe(result => {
      this.images = (result?.hits || []).map((img: any) => img.largeImageURL);
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  shareRecommendation() {
    const shareData = {
      title: this.spot.name,
      text: this.spot.shortDesc,
      url: window.location.href
    };
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

  favoriteRecommendation() {
    this.isFavorite = !this.isFavorite;
    if(this.isFavorite) {
      this.spot.isFavorite = true;
    } else {
      this.spot.isFavorite = false;
    }
  }

  openMap() {
    const url = this.spot.mapUrl || `https://www.google.com/maps/search/?api=1&query=${this.spot.latitude},${this.spot.longitude}`;
    window.open(url, '_blank');
  }
}
