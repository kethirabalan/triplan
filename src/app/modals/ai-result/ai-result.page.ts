import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, ModalController, IonButtons, IonIcon  } from '@ionic/angular/standalone';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-result',
  templateUrl: './ai-result.page.html',
  styleUrls: ['./ai-result.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonSpinner, 
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,IonButton, IonButtons, IonIcon]
})
export class AiResultPage implements OnInit {
  @Input() aiPlan: any;
  @Input() itinerary: any[] = [];
  images: { [key: string]: string } = {};
  loading = false;

  constructor(
    private pixabay: PixabayService,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // this.loading = true;
    // this.pixabay.getImages(this.itinerary.map(day => day.image_query)).then((images: any) => {
    //   this.images = images;
    //   this.loading = false;
    // }).catch((error: any) => {
    //   console.error('Error fetching images:', error);
    //   this.loading = false;
    // });  
  }

  saveItinerary() {
    // Implement save logic or navigation
    this.router.navigate(['/tabs/trips']);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
