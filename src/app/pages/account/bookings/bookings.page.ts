import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonBackButton } from '@ionic/angular/standalone';
import { ComingSoonComponent } from 'src/app/components/slider/coming-soon/coming-soon/coming-soon.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonButtons, IonBackButton,ComingSoonComponent]
})
export class BookingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
