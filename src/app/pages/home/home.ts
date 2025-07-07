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
import { Router, RouterLink } from '@angular/router';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';
import { AuthService } from 'src/app/services/auth.service';

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
  isScrolled = false;
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
  recentlyViewed: any[] = [];
  constructor(private toastController: ToastController, private platform: Platform, 
    private geminiService: GeminiService, private pixabay: PixabayService, 
    private firebaseFirestoreService: FirebaseFirestoreService, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
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

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isScrolled = scrollTop > 30; // adjust as needed
  }

  viewPlace(place: any) {  
    this.recentlyViewed = [
      place,
      ...this.recentlyViewed.filter(p => p.place !== place.place)
    ].slice(0, 5);
  
    localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed));
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
      await this.saveCurrentLocation(lat, lon, city, country);
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

  async saveCurrentLocation(lat: number, lon: number, city: string, country: string) {
    try {
      const currentUser = await this.authService.getCurrentAuthUser();
      if (currentUser) {
        const locationData = {
          latitude: lat,
          longitude: lon,
          city: city,
          country: country,
          locationName: `${city}, ${country}`,
          timestamp: this.firebaseFirestoreService.timestamp
        };

        const userPath = `users/${currentUser.uid}`;
        await this.firebaseFirestoreService.update(userPath, {
          currentLocation: locationData,
          _meta: {
            _0: "users",
            _1: currentUser.uid,
            cancelTrigger: false,
            createdAt: this.firebaseFirestoreService.timestamp,
            updatedAt: this.firebaseFirestoreService.timestamp
          }
        });
      } else {
        await this.showToast('Please sign in to save your location');
        this.router.navigate(['/tabs/account']);
      }
    } catch (error) {
      console.error('Error saving current location:', error);
    }
  }
}