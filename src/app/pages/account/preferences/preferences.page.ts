import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ComingSoonComponent } from 'src/app/components/slider/coming-soon/coming-soon/coming-soon.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonBackButton,ComingSoonComponent]
})
export class PreferencesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
