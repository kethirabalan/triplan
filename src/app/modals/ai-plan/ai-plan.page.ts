import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonList, IonLabel, IonButtons, 
  IonIcon, IonCheckbox, IonSegment, IonSegmentButton, IonListHeader, IonProgressBar, IonGrid, IonRow, IonCol,
   IonThumbnail, IonText, IonFooter, IonSpinner, IonChip, IonItemGroup, IonModal } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ai-plan',
  templateUrl: './ai-plan.page.html',
  styleUrls: ['./ai-plan.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput, IonList, IonLabel,
    IonButtons, IonIcon, IonCheckbox, IonSegment, IonSegmentButton, IonListHeader, IonProgressBar, IonGrid, 
    IonRow, IonCol,IonThumbnail, IonText,IonFooter,IonSpinner,IonChip, IonItemGroup, IonModal,ReactiveFormsModule]
})
export class AiPlanPage implements OnInit {
  activeStep = 1;
  totalSteps = 5;
  aiPlanForm: FormGroup;
  searchTerm = '';
  cities = [
    { name: 'Paris', region: 'Ile-de-France, France', imageUrl: 'https://cdn.pixabay.com/photo/2015/03/26/09/54/eiffel-tower-690050_1280.jpg' },
    { name: 'Dubai', region: 'Emirate of Dubai, UAE', imageUrl: 'https://cdn.pixabay.com/photo/2017/01/20/00/30/dubai-1997729_1280.jpg' },
    { name: 'Las Vegas', region: 'Nevada, USA', imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/09/32/architecture-1868667_1280.jpg' },
    { name: 'London', region: 'England, UK', imageUrl: 'https://cdn.pixabay.com/photo/2016/11/18/16/19/london-1839519_1280.jpg' },
    { name: 'Cancun', region: 'Yucatan Peninsula, Mexico', imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/09/32/beach-1867883_1280.jpg' }
  ];
  months = ['July', 'August', 'September', 'October'];
  companions = ['Going solo', 'Partner', 'Friends', 'Family'];
  interests = [
    'Must-see Attractions', 'Great Food', 'Hidden Gems', 'Tours & Experiences',
    'Eiffel Tower highlights', 'Versailles guided tours', 'French wine & gourmet delights',
    'French Cuisine', 'Art Museums', 'Historical Landmarks', 'Luxury Shopping', 'River Seine Cruise'
  ];

  constructor(private router: Router, private fb: FormBuilder) {
    this.aiPlanForm = this.fb.group({
      destination: [null, Validators.required],
      tripLength: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      month: [''],
      companions: ['', Validators.required],
      interests: [[], Validators.required],
      otherInterests: ['']
    });
  }

  ngOnInit() {}

  filteredCities() {
    if (!this.searchTerm) return this.cities;
    return this.cities.filter(city => city.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
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
      default: return true;
    }
  }

  nextStep() {
    if (this.activeStep < this.totalSteps) {
      this.activeStep++;
    } else {
      this.router.navigate(['/modals/ai-result'], { state: { aiPlan: this.aiPlanForm.value } });
    }
  }

  prevStep() {
    if (this.activeStep > 1) this.activeStep--;
  }

  closeModal() {
    window.history.back();
  }
}
