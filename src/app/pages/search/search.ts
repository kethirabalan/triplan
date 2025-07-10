import { Component, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonSearchbar, IonIcon, IonItem,IonButton,IonThumbnail,IonLabel,
  IonList,IonToolbar,IonBackButton,IonButtons } from '@ionic/angular/standalone';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, IonSearchbar, IonIcon, IonItem, IonButton, IonThumbnail,IonLabel,
    IonList,IonToolbar,IonBackButton,IonButtons]
})
export class Search implements OnInit {
  allPlaces = recommendedPlaces;
  places = recommendedPlaces.slice(0, 3);
  user: any;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) {
  }

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

  goToPlace(place: any) {
    if(!this.user) {
      this.toastController.create({
        message: 'Please sign in to view this place',
        duration: 2000,
        color: 'primary'
      }).then(toast => toast.present());
      return;
    }
    this.router.navigate(['/tabs/home/view-recommendation'], { state: { item: place} });
  }

}
