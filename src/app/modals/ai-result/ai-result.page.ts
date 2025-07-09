import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, ModalController, IonButtons, IonIcon, ToastController   } from '@ionic/angular/standalone';
import { PixabayService } from 'src/app/services/pixabay.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';

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
    private authService: AuthService,
    private toastCtrl: ToastController,
    private firestoreService: FirebaseFirestoreService
  ) { 
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.pixabay.getImages(this.itinerary.map(day => day.image_query)).then((imageResults: any[]) => {      
      // Process the image results and create a mapping
      this.images = {};
      imageResults.forEach((imageArray, index) => {
        if (imageArray && imageArray.length > 0) {
          // Use the first image from each result
          const imageUrl = imageArray[0].webformatURL;
          this.images[this.itinerary[index].image_query] = imageUrl;
        } else {
          // console.log(`No images found for: ${this.itinerary[index].image_query}`);
        }
      });
      this.loading = false;
    }).catch((error: any) => {
      this.loading = false;
    });  
  }

  async saveItinerary() {
    try {
      const itineraryCollectionPath = `users/${this.user.uid}/itineraries`;
      await this.firestoreService.add(itineraryCollectionPath, {
      itinerary: this.itinerary,
      aiPlan: this.aiPlan,
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

  backToHome() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs/home']);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
