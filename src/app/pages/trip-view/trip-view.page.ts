import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonInput, IonIcon, ModalController, 
  IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonBadge, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CustomSearchPage } from 'src/app/modals/custom-search/custom-search.page';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip-view.page.html',
  styleUrls: ['./trip-view.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonModal, 
    IonButton, IonInput, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonIcon, IonBadge,IonButtons,IonBackButton]
})
export class TripViewPage implements OnInit {
  tripName: string = '';
  constructor(private route: ActivatedRoute, private modalController: ModalController) { }

  ngOnInit() { 
    this.tripName = this.route.snapshot.paramMap.get('tripName') || '';
  }

  async createTrip() {
    const modal = await this.modalController.create({
      component: CustomSearchPage,
      componentProps: {
        fromPage: 'trip-view'
      }
    });
    await modal.present();
  }

  async addPlace(place: any) {
    console.log(place);
  }

  async addSaves(saves: any) {
    console.log(saves);
  }

  async addItinerary(itinerary: any) {
    console.log(itinerary);
  }

  async deleteTrip() {
    console.log('delete trip');
  }

  async editTrip() {
    console.log('edit trip');
  }

  async inviteToTrip() {
    console.log('invite to trip');
  }

  async shareTrip() {
    console.log('share trip');
  }

  async deletePlace(place: any) {
    console.log('delete place');
  }

  async deleteSave(save: any) {
    console.log('delete save');
  }

  async deleteItinerary(itinerary: any) {
    console.log('delete itinerary');
  }

  async deleteAll() {
    console.log('delete all');
  }

  async addPlaceToItinerary(place: any) {
    console.log('add place to itinerary');
  }

  async addSaveToItinerary(save: any) {
    console.log('add save to itinerary');
  }

  async startExploring() {
    console.log('start exploring');
  }



}
