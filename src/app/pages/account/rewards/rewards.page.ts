import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton,IonIcon,IonSegment,IonSegmentButton,IonLabel,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DotLottie } from '@lottiefiles/dotlottie-web';
  
@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons, IonBackButton,IonIcon,
    IonSegment,IonSegmentButton,IonLabel,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonText]
})
export class RewardsPage implements OnInit {
  segment: string = 'rewards';
  rewards: any[] = [];
  offers: any[] = [];
  dotLottie: DotLottie | null = null;

  constructor(private router: Router) { 
    this.rewards = [
      {
        title: 'Triplan Rewards',
        description: 'Valid for use on eligible hotels directly booked on the app',
        amount: '$0.00'
      }
    ];
  }
  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }
  ngOnInit() {
    const canvas = document.querySelector('#dotlottie-canvas') as HTMLCanvasElement;
    if (canvas) {
      this.dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        speed: 1,
        canvas: canvas,
        src: "https://lottie.host/dcab8fe1-a3c7-4115-aca8-f5dce2640acc/90wNu8KLT2.lottie"
      });
    }
  }
  ionViewWillEnter() {
    this.segment = 'rewards';
  }

}
