import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard,IonIcon, IonButton,IonLabel,
  IonText,IonItem,IonInput,IonModal,ModalController,IonCardContent,IonActionSheet,IonList,IonThumbnail,IonFab,IonFabButton,IonFabList} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { TripService } from 'src/app/services/trip.service';
import { AuthService } from 'src/app/services/auth.service';
import { SignPage } from 'src/app/modals/sign/sign.page';
import { LoadingService } from 'src/app/services/loading.service';
import { addIcons } from 'ionicons';
import { calendarOutline, heartOutline, globeOutline, personAddOutline, trashOutline, shareOutline, close, addCircleOutline, sparklesOutline, ellipsisVertical } from 'ionicons/icons';

@Component({
  selector: 'app-trips',
  templateUrl: 'trips.html',
  styleUrls: ['trips.scss'],
  standalone: true,
  providers: [TripService,ActionSheetController,ModalController],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonIcon, IonButton, IonLabel, 
    IonText,RouterLink,IonItem,IonInput,CommonModule,FormsModule,IonModal,IonCardContent,IonActionSheet,IonList,IonThumbnail,IonFab,IonFabButton,IonFabList],
})
export class Trips implements OnInit{
  tripName: string = '';
  trips: any[] = [];
  user: any;
  isModalOpen = false;
  loading = false;
  constructor(private router: Router, private modal: ModalController, private actionSheetCtrl: ActionSheetController, 
    private tripService: TripService, private authService: AuthService, private modalCtrl: ModalController, private loadingService: LoadingService) {
      this.authService.currentUser$.subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });

      this.tripService.getTrips().subscribe((trips) => {
        this.trips = trips;
        this.loadingService.hideLoading();
        this.loading = false;
        if(trips.length === 0) {
          this.loading = false;
        }
      });
      addIcons({
        calendarOutline,
        heartOutline,
        ellipsisVertical,
        globeOutline,
        personAddOutline,
        trashOutline,
        shareOutline,
        close,
        addCircleOutline,
        sparklesOutline
      })
    }

  ngOnInit() {
    this.loading = true;
    this.loadingService.showLoading('Loading...');
  }

  // async createTrip(name: string) {
  //   if (name) {
  //     this.modal.dismiss();
  //     await this.router.navigate(['/tabs/trips/trip-view', name]);
  //     this.tripName = '';
  //   }
  // }

  async createTrip(tripName: string) {
    const trip = {
      _meta: {
        createdBy: this.user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      name: tripName,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      imageUrl: 'assets/images/placeholderimg.png',
    };
    await this.tripService.addTrip(trip);
    await this.router.navigate(['/tabs/trips/trip-view', trip.name]);
    this.modal.dismiss();
    this.tripName = '';
  }

  async openTripOptions(trip: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Trip options',
      cssClass: 'trip-action-sheet',
      buttons: [
        { text: 'Share', icon: 'share-outline', handler: () => {
          this.shareTrip(trip);
        } },
        { text: 'Make public', icon: 'globe-outline', handler: () => {/*...*/} },
        { text: 'Invite', icon: 'person-add-outline', handler: () => {/*...*/} }, 
        { text: 'Delete', icon: 'trash-outline', role: 'destructive', handler: () => {/*...*/} },
        { text: 'Edit', icon: 'pencil-outline', handler: () => {/*...*/} },
        { text: 'Cancel', icon: 'close', role: 'cancel' }
      ]
    }); 
    await actionSheet.present();
  }

  async shareTrip(trip: any) {
    // const modal = await this.modalCtrl.create({
    //   component: SharePage,
    //   componentProps: {
    //     trip: trip,
    //   },
    // });
    // modal.present();
  }

  async signIn() {
    const modal = await this.modalCtrl.create({
      component: SignPage,
      componentProps: {
        isSignIn: true,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    this.isModalOpen = false;
    if (role === 'signIn') {
      this.authService.signInWithEmailAndPassword(data.email, data.password);
    }
  }
}
