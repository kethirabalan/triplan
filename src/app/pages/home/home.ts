import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSearchbar,
  IonList, IonListHeader, IonLabel, IonItem, IonText, IonThumbnail, IonCard, IonCardHeader, IonCardTitle, IonModal, IonCardContent, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import { ToastController, Platform, ModalController } from '@ionic/angular';
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
import { CustomSearchPage } from 'src/app/modals/custom-search/custom-search.page';
import { NotificationsPage } from 'src/app/modals/notifications/notifications.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  providers: [ModalController],
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonListHeader, IonLabel, IonItem, IonText, CommonModule, SliderComponent, IonThumbnail, RouterLink,
    IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home implements OnInit {
  locationName: string | any;
  recommendedPlaces: any[] = staticRecommended;
  adventureContent: any[] = staticAdventure;
  bestRestaurants: any[] = staticBestRestaurants;
  isScrolled = false;
  selectedPlace: any;
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
  items: any[] = [];
  isViewAllModalOpen = false;
  recentlyViewed: any[] = [];
  constructor(private toastController: ToastController, private platform: Platform,
    private geminiService: GeminiService, private pixabay: PixabayService,
    private firebaseFirestoreService: FirebaseFirestoreService, private authService: AuthService, private router: Router,
    private modalCtrl: ModalController, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    // Load dynamic recommendations
    try {
      const recommendations = await this.geminiService.getGlobalRecommendations();
      const imageLoadPromises = recommendations.map(place =>
        this.pixabay.searchImage(place.image_query).toPromise().then(result => {
          place.image = result?.hits?.[0]?.largeImageURL || 'assets/images/placeholderimg.png';
        })
      );

      await Promise.all(imageLoadPromises);

      // Shuffle the recommendations array before assigning
      this.recommendedPlaces = this.shuffleArray(recommendations);
    } catch (err) {
      console.error('Failed to load recommendedPlaces:', err);
      this.recommendedPlaces = staticRecommended;
    }

    // Load dynamic adventure content
    try {
      const adventures = await this.geminiService.getGlobalAdventure();
      // Load images using Promises to wait until all are fetched
      const imageLoadPromises = adventures.map(content =>
        this.pixabay.searchImage(content.image_query).toPromise().then(result => {
          content.image = result?.hits?.[0]?.largeImageURL || 'assets/images/placeholderimg.png';
        })
      );

      await Promise.all(imageLoadPromises);

      // Shuffle before assigning
      this.adventureContent = this.shuffleArray(adventures);
    } catch (err) {
      console.error('Failed to load adventureContent:', err);
      this.adventureContent = staticAdventure;
    }

    // try {
    //   const bestRestaurants = await this.geminiService.getGlobalRestaurants();
    //   this.bestRestaurants = bestRestaurants;
    //   this.bestRestaurants.forEach(restaurant => {
    //     this.pixabay.searchImage(restaurant.image_query).subscribe(result => {
    //       restaurant.image = result.hits?.[0]?.largeImageURL || 'assets/images/placeholderimg.png';
    //     });
    //   });
    // } catch (err) {
    //   console.error('Failed to load bestRestaurants:', err);
    //   this.bestRestaurants = staticBestRestaurants;
    // }
  }

  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle
    while (currentIndex !== 0) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Swap it with the current element
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ];
    }

    return array;
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

  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsPage,
      componentProps: {
        fromPage: 'home'
      }
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss()
    if (data && role === 'select') {
      this.selectedPlace = data;
      this.cdr.detectChanges();
    }
  }

  viewAll(items: any[]) {
    this.items = items;
    this.isViewAllModalOpen = true;
  }

  dismissViewAllModal() {
    this.isViewAllModalOpen = false;
  }

  onItemClick(item: any) {
    this.router.navigate(['/tabs/home/view-place'], { state: { item: item } });
  }

  async openCustomSearch() {
    const modal = await this.modalCtrl.create({
      component: CustomSearchPage,
      componentProps: {
        fromPage: 'home'
      }
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss()
    if (data && role === 'select') {
      this.selectedPlace = data;
      this.cdr.detectChanges();
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
        await this.firebaseFirestoreService.update(userPath, currentUser.uid as any, {
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