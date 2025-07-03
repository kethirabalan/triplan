import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons,IonBackButton } from '@ionic/angular/standalone';
import { ComingSoonComponent } from 'src/app/components/slider/coming-soon/coming-soon/coming-soon.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, 
    FormsModule,IonButtons,IonBackButton,ComingSoonComponent]
})
export class SupportPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
