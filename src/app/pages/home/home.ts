import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSearchbar,
  IonList, IonListHeader, IonLabel, IonItem, IonText
} from '@ionic/angular/standalone';
import { ToastController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';
import { adventureContent } from 'src/app/data/adventure-content';

@Component({
  selector: 'app-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonListHeader, IonLabel, IonItem, IonText, CommonModule, SliderComponent],
})
export class Home implements OnInit{
  locationName: string | null = null;
  recommendedPlaces = recommendedPlaces;
  adventureContent = adventureContent;
  constructor(private toastController: ToastController, private platform: Platform) { }

  ngOnInit() {}

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
      console.log('data', data);
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