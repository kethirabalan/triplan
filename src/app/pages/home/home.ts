import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSearchbar,
  IonList, IonListHeader, IonLabel, IonItem, IonText
} from '@ionic/angular/standalone';
import { ToastController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { adventureContent } from 'src/app/data/adventure-content';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonListHeader, IonLabel, IonItem, IonText, CommonModule, SliderComponent],
})
export class Home implements OnInit{
  locationName: string | any;
  recommendedPlaces: any[] = [];
  adventureContent: any[] = [];
  constructor(private toastController: ToastController, private platform: Platform, private geminiService: GeminiService, private pixabay: PixabayService) { }

  async ngOnInit() {
    this.requestLocation();
    this.recommendedPlaces = await this.geminiService.getGlobalRecommendations();
    this.recommendedPlaces.forEach(place => {
      this.pixabay.searchImage(place.image_query).subscribe(result => {
        place.image = result.hits?.[0]?.largeImageURL || 'assets/images/placeholderimg.png';
      });
    });
    this.adventureContent = await this.geminiService.getGlobalAdventure();
    console.log("this.adventureContent",this.adventureContent);
    
    this.adventureContent.forEach(content => {
      this.pixabay.searchImage(content.image_query).subscribe(result => {
        content.image = result.hits?.[0]?.largeImageURL || 'assets/images/placeholderimg.png';
      });
    });
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