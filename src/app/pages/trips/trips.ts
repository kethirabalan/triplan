import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard,IonIcon, IonButton,IonLabel,
  IonText,IonItem,IonInput,IonModal,ModalController} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trips',
  templateUrl: 'trips.html',
  styleUrls: ['trips.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonIcon, IonButton, IonLabel, 
    IonText,RouterLink,IonItem,IonInput,CommonModule,FormsModule,IonModal],
})
export class Trips {
  tripName: string = '';
  constructor(private router: Router, private modal: ModalController) {}

  async createTrip(name: string) {
    if (name) {
      this.modal.dismiss();
      await this.router.navigate(['/tabs/trips/trip-view', name]);
      this.tripName = '';
    }
  }
}
