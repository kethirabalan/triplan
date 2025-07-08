import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonList, IonLabel, IonButtons, 
  IonIcon, IonCheckbox, IonSegment, IonSegmentButton, IonListHeader, IonProgressBar, IonGrid, IonRow, IonCol,
   IonThumbnail, IonText, IonFooter, IonSpinner, IonChip, IonItemGroup } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

interface AiPlanForm {
  destination: any;
  tripLength: number;
  month: string;
  companions: string;
  interests: string[];
  otherInterests: string;
}

@Component({
  selector: 'app-ai-plan',
  templateUrl: './ai-plan.page.html',
  styleUrls: ['./ai-plan.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput, IonList, IonLabel,
    IonButtons, IonIcon, IonCheckbox, IonSegment, IonSegmentButton, IonListHeader, IonProgressBar, IonGrid, 
    IonRow, IonCol,IonThumbnail, IonText,IonFooter,IonSpinner,IonChip,ReactiveFormsModule, IonItemGroup ]
})
export class AiPlanPage implements OnInit {
  activeStep = 1;
  totalSteps = 5;
  form: AiPlanForm = {
    destination: null,
    tripLength: 3,
    month: '',
    companions: '',
    interests: [],
    otherInterests: ''
  };
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

  constructor(private router: Router) {
   }

  ngOnInit() {}

  filteredCities() {
    if (!this.searchTerm) return this.cities;
    return this.cities.filter(city => city.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  selectCity(city: any) {
    this.form.destination = city;
  }

  selectMonth(month: string) {
    this.form.month = month;
  }

  selectCompanion(companion: string) {
    this.form.companions = companion;
  }

  toggleInterest(interest: string) {
    const idx = this.form.interests.indexOf(interest);
    if (idx > -1) this.form.interests.splice(idx, 1);
    else this.form.interests.push(interest);
  }

  canProceed() {
    switch (this.activeStep) {
      case 1: return !!this.form.destination;
      case 2: return this.form.tripLength > 0;
      case 3: return !!this.form.companions;
      case 4: return this.form.interests.length > 0;
      default: return true;
    }
  }

  nextStep() {
    if (this.activeStep < this.totalSteps) {
      this.activeStep++;
    } else {
      // Navigate to result page with form data
      this.router.navigate(['/modals/ai-result'], { state: { aiPlan: this.form } });
    }
  }

  prevStep() {
    if (this.activeStep > 1) this.activeStep--;
  }

  closeModal() {
    window.history.back();
  }

  decrementTripLength() {
    this.form.tripLength = Math.max(1, this.form.tripLength - 1);
  }

  incrementTripLength() {
    this.form.tripLength = Math.min(7, this.form.tripLength + 1);
  }
}
