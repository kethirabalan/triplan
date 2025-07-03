import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton,IonButton,IonIcon } from '@ionic/angular/standalone';
import { ComingSoonComponent } from 'src/app/components/slider/coming-soon/coming-soon/coming-soon.component';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons, IonBackButton,
    IonButton,IonIcon,ComingSoonComponent]
})
export class RewardsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
