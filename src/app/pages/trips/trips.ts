import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard,IonIcon, IonButton,IonLabel,
  IonText, IonModal,IonItem,IonInput} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trips',
  templateUrl: 'trips.html',
  styleUrls: ['trips.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonIcon, IonButton, IonLabel, 
    IonText,RouterLink,IonModal,IonItem,IonInput,CommonModule,FormsModule],
})
export class Trips {
  tripName: string = '';
  constructor(private router: Router) {}

  createTrip(modal: HTMLIonModalElement) {
    const name = this.tripName.trim();
    if (name) {
      modal.dismiss();
      this.router.navigate(['/trip-view'], {
        queryParams: { name } // You can access this in trip-view
      });
      this.tripName = ''; // optional: reset field
    }
  }
}
