import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons,IonBackButton,IonList,IonItem,IonLabel,IonIcon } from '@ionic/angular/standalone';
@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, 
    FormsModule,IonButtons,IonBackButton,IonList,IonItem,IonLabel,IonIcon]
})
export class SupportPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
