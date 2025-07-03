import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton,IonGrid,IonRow, 
  IonButtons,IonFab,IonFabButton,IonIcon,IonCard,IonImg, IonLabel,IonFabList,IonText,IonCol } from '@ionic/angular/standalone';
import { SliderComponent } from "../../components/slider/slider.component";

@Component({
  selector: 'app-review',
  templateUrl: 'review.html',
  styleUrls: ['review.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonFab, IonFabButton, IonIcon, 
    IonCard, IonImg, SliderComponent, IonLabel,IonFabList, IonText, IonGrid,IonRow,IonCol],
})
export class Review {
  reviewOverlay = {
   title: 'We want you to write us a review',
   subtitle: 'Because who else would we turn to for travel advice?',
   image: 'https://www.visitbritainshop.com/sites/default/files/styles/open_graph_image/public/2023-03/Stonehenge%20%283%29.png?h=e2dcec25&itok=Nby6Hnr5',
   buttonTitle: 'What to know'
  }
  constructor() {}
}
