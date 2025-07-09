import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, ModalController, IonButtons, IonIcon, ToastController   } from '@ionic/angular/standalone';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

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
  user: any;
  constructor(
    private pixabay: PixabayService,
    private router: Router,
    private modalCtrl: ModalController,
    private firestore: Firestore,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { 
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.pixabay.getImages(this.itinerary.map(day => day.image_query)).then((images: any) => {
      this.images = images;
      this.loading = false;
    }).catch((error: any) => {
      console.error('Error fetching images:', error);
      this.loading = false;
    });  
  }

  async saveItinerary() {
    try {
      const itinerariesRef = collection(this.firestore, 'users', this.user.uid, 'itineraries');
      await addDoc(itinerariesRef, {
        itinerary: this.itinerary,
        aiPlan: this.aiPlan,
        createdAt: new Date()
      });
      
      const toast = await this.toastCtrl.create({
        message: 'Itinerary saved successfully',
        duration: 2000
      });
      await toast.present();
      this.modalCtrl.dismiss();
      this.router.navigate(['/tabs/trips']);
    } catch (error) {
      console.error('Error saving itinerary:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to save itinerary',
        duration: 2000
      });
      await toast.present();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
