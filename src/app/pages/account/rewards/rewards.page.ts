import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton,IonIcon,IonSegment,IonSegmentButton,IonLabel,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

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
  }
  ionViewWillEnter() {
    this.segment = 'rewards';
  }

}
