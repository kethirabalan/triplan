import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonList, IonLabel, IonButtons, 
  IonIcon, IonCheckbox, IonSegment, IonSegmentButton, IonListHeader, IonProgressBar, IonGrid, IonRow, IonCol,
   IonThumbnail, IonText, IonFooter, IonSpinner, IonChip, IonItemGroup, IonSearchbar, ModalController, IonDatetime, ToastController, IonModal, IonDatetimeButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { recommendedPlaces } from 'src/app/data/recommendedPlaces';
import { AiResultPage } from '../ai-result/ai-result.page';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';

@Component({
  selector: 'app-ai-plan',
  templateUrl: './ai-plan.page.html',
  styleUrls: ['./ai-plan.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput, IonList, IonLabel,
    IonButtons, IonIcon, IonCheckbox, IonSegment, IonSegmentButton, IonListHeader, IonProgressBar, IonGrid, 
    IonRow, IonCol,IonThumbnail, IonText,IonFooter,IonSpinner,IonChip, IonItemGroup, ReactiveFormsModule, IonSearchbar, IonDatetime, IonModal, IonDatetimeButton]
})
export class AiPlanPage implements OnInit {
  activeStep = 1;
  totalSteps = 5;
  aiPlanForm: FormGroup;
  searchTerm: any;
  // segmentValue: any = 'tripLength';
  cities: any[] = recommendedPlaces;
  minDate = new Date().toISOString(); // today
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(); // optional
  months = ['July', 'August', 'September', 'October'];
  companions = ['Going solo', 'Partner', 'Friends', 'Family'];
  interests = [
    'Must-see Attractions', 'Great Food', 'Hidden Gems', 'Tours & Experiences',
    'Eiffel Tower highlights', 'Versailles guided tours', 'French wine & gourmet delights',
    'French Cuisine', 'Art Museums', 'Historical Landmarks', 'Luxury Shopping', 'River Seine Cruise'
  ];
  loadingAI = false;
  aiItinerary: any[] = [];

  constructor(private router: Router, private fb: FormBuilder, private modalCtrl: ModalController, private toastCtrl: ToastController, private gemini: GeminiService, private pixabay: PixabayService) {
    this.aiPlanForm = this.fb.group({
      destination: [null, Validators.required],
      tripLength: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      month: [''],
      companions: ['', Validators.required],
      interests: [[], Validators.required],
      otherInterests: [''],
      // date: [[]]
    });
  }

  ngOnInit() {
  }

  // segmentChanged(event: any) {
  //   this.segmentValue = event.detail.value;
  // }

  // validateRange(event: any) {
  //   const range = event.detail.value;
  //   if (range && range.length > 0) {
  //     const fromDate = new Date(range[0]);
  //     const toDate = new Date(range[range.length - 1]);
  //     const diffDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));

  //     if (diffDays > 7) {
  //       this.aiPlanForm.get('date')?.setValue(null);
  //       this.showToast('Please select a range of 7 days or less.');
  //     }
  //   }
  // }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 2000
    }).then(toast => toast.present());
  }

  filteredCities() {
    if (!this.searchTerm) return this.cities.slice(0, 5);
    return this.cities.filter(city => city.name.toLowerCase().includes(this.searchTerm.toLowerCase())).slice(0, 5);
  }

  selectCity(city: any) {
    this.aiPlanForm.get('destination')?.setValue(city);
  }

  selectMonth(month: string) {
    this.aiPlanForm.get('month')?.setValue(month);
  }

  selectCompanion(companion: string) {
    this.aiPlanForm.get('companions')?.setValue(companion);
  }

  toggleInterest(interest: string) {
    const interests = this.aiPlanForm.get('interests')?.value || [];
    const idx = interests.indexOf(interest);
    if (idx > -1) {
      interests.splice(idx, 1);
    } else {
      interests.push(interest);
    }
    this.aiPlanForm.get('interests')?.setValue([...interests]);
  }

  decrementTripLength() {
    const val = Math.max(1, this.aiPlanForm.get('tripLength')?.value - 1);
    this.aiPlanForm.get('tripLength')?.setValue(val);
  }
  incrementTripLength() {
    const val = Math.min(7, this.aiPlanForm.get('tripLength')?.value + 1);
    this.aiPlanForm.get('tripLength')?.setValue(val);
  }

  canProceed() {
    switch (this.activeStep) {
      case 1: return this.aiPlanForm.get('destination')?.valid;
      case 2: return this.aiPlanForm.get('tripLength')?.valid;
      case 3: return this.aiPlanForm.get('companions')?.valid;
      case 4: return (this.aiPlanForm.get('interests')?.value || []).length > 0;
      case 5: return true;
      default: return true;
    }
  }

  async nextStep() {
    if (this.activeStep < this.totalSteps) {
      this.activeStep++;
      if (this.activeStep === 5) {
        this.loadingAI = true;
        // Simulate AI call with a short delay, then open result modal
        setTimeout(async () => {
          this.aiItinerary = [
            {
              name: 'Day 1',
              description: 'Visit the Eiffel Tower',
              type: 'Attraction',
              rating: 4.5,
              location: 'Paris, France',
              image_query: 'Eiffel Tower'
            }
          ];
          this.loadingAI = false;
          await this.modalCtrl.dismiss();

          // Open AiResultPage as a new modal
          const modal = await this.modalCtrl.create({
            component: AiResultPage,
            componentProps: {
              aiPlan: this.aiPlanForm.value,
              itinerary: this.aiItinerary
            }
          });
          await modal.present();
        }, 1200);
      }
    } else {
      // This else block is not needed anymore since step 5 handles the modal
    }
  }

  prevStep() {
    if (this.activeStep > 1) this.activeStep--;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
