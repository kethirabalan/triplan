import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonList, IonThumbnail, IonLabel, IonIcon, 
  IonButton,IonButtons,IonSearchbar,IonBackButton,ModalController, ToastController } from '@ionic/angular/standalone';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

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
  user: any;
  @Input() fromPage: string = '';

  constructor(private modalCtrl: ModalController, private router: Router, private authService: AuthService, private toastController: ToastController) {}

  async ngOnInit() {
    this.user = await firstValueFrom(this.authService.currentUser$);
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

  async selectPlace(place: any) {
    if(!this.user) {
      this.toastController.create({
        message: 'Please sign in to view this place',
        duration: 2000,
        color: 'primary'
      }).then(toast => toast.present());
      return;
    }
    this.selectedPlace = place;
    this.modalCtrl.dismiss(this.selectedPlace, 'select');
    if (this.fromPage === 'home') {
      await this.router.navigate(['/tabs/home/view-recommendation'], { state: { item: place } });
      await this.modalCtrl.dismiss(null, 'select');
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
