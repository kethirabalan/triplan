import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonBackButton,IonList,
  IonItem,IonLabel,IonNote,IonIcon,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonButton,IonModal,IonThumbnail,IonText } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { DotLottie } from '@lottiefiles/dotlottie-web';

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
  dotLottie: DotLottie | null = null;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const canvas = document.querySelector('#dotlottie-canvas') as HTMLCanvasElement;
    if (canvas) {
      this.dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        speed: 1,
        canvas: canvas,
        src: "https://lottie.host/5c1c36af-7b0e-438e-bf9f-197d89a3d2fb/LMonNwiqEF.lottie"
      });
    }
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
