import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSearchbar,
  IonList, IonListHeader, IonLabel, IonItem, IonText,IonThumbnail,IonCard,IonCardHeader,IonCardTitle
} from '@ionic/angular/standalone';
import { ToastController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';
import { recommendedPlaces as staticRecommended } from 'src/app/data/recommendedPlaces';
import { adventureContent as staticAdventure } from 'src/app/data/adventure-content';
import { staticBestRestaurants } from 'src/app/data/staticBestRestaurants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonListHeader, IonLabel, IonItem, IonText, CommonModule, SliderComponent,IonThumbnail, RouterLink],
})
export class Home implements OnInit{
  locationName: string | any;
  recommendedPlaces: any[] = staticRecommended;
  adventureContent: any[] = staticAdventure;
  bestRestaurants: any[] = staticBestRestaurants;
  customFeed = {
    title: 'Triplan Rewards',
    subtitle: 'Book with Triplan, earn 5% back on hotals in Dubai',
    image: 'https://www.culinaryspecialties.net/wp-content/uploads/2021/11/Making-Breakfast-a-Valuable-Hotel-Guest-Add-On-1.jpg',
    buttonTitle: 'Find a hotel'
  }
  exploreCard = {
    title: '12 island getaways we love',
    image: 'https://images.pexels.com/photos/29974430/pexels-photo-29974430.jpeg',
    buttonTitle: 'Explore'
  }
  recentlyViewed = {
    image: 'https://images.unsplash.com/photo-1569096651661-820d0de8b4ab?q=80&w=663&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',  
    place: 'Cozy Restaurant',
    rating: '4.7',
    tag: 'Copenhague, Denmark'
  };
  constructor(private toastController: ToastController, private platform: Platform, 
    private geminiService: GeminiService, private pixabay: PixabayService) { }

  async ngOnInit() {
    // this.requestLocation();
    // Load dynamic recommendations
    try {
      // const recommendations = await this.geminiService.getGlobalRecommendations();
      // recommendations.forEach(place => {
      //   this.pixabay.searchImage(place.image_query).subscribe(result => {
      //     place.image = result.hits?.[0]?.largeImageURL || 'assets/images/placeholderimg.png';
      //   });
      // });
      // this.recommendedPlaces = recommendations;
    } catch (err) {
      console.error('Failed to load recommendedPlaces:', err);
    }

    // Load dynamic adventure content
    try {
      // const adventures = await this.geminiService.getGlobalAdventure();
      // adventures.forEach(content => {
      //   this.pixabay.searchImage(content.image_query).subscribe(result => {
      //     content.image = result.hits?.[0]?.largeImageURL || 'assets/images/placeholderimg.png';
      //   });
      // });
      // this.adventureContent = adventures;
    } catch (err) {
      console.error('Failed to load adventureContent:', err);
    }
  }

  async requestLocation() {
    try {
      if (this.platform.is('capacitor')) {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'granted') {
          const pos = await Geolocation.getCurrentPosition();
          this.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        } else {
          this.showToast('Location permission denied.');
        }
      } else {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.reverseGeocode(position.coords.latitude, position.coords.longitude);
            },
            () => {
              this.showToast('Location access denied or unavailable.');
            }
          );
        } else {
          this.showToast('Geolocation is not supported in this browser.');
        }
      }
    } catch (err) {
      console.error(err);
      this.showToast('Error accessing location.');
    }
  }

  async reverseGeocode(lat: number, lon: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await response.json();
      const city = data.address.city || data.address.county || data.address.village || '';
      const country = data.address.country || '';
      this.locationName = `${city}, ${country}`;
      this.showToast('Location access granted!');
    } catch (error) {
      console.error('Reverse geocoding failed', error);
      this.showToast('Could not determine location name.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }
}