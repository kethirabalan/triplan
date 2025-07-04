import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonBackButton,IonList,
  IonItem,IonLabel,IonNote,IonIcon,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonButton,IonModal,IonThumbnail,IonText } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  providers: [ModalController,IonModal],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonButtons, IonBackButton,IonList,IonItem,IonLabel,IonNote,IonIcon,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonButton,IonThumbnail,IonText]
})
export class BookingsPage implements OnInit {
  bookings: any[] = [];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.bookings = [
      {
        id: 1,
        name: 'Hotel 1',
        image: 'https://via.placeholder.com/150',
      }
    ];
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
