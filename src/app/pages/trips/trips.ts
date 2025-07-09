import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard,IonIcon, IonButton,IonLabel,IonCardHeader,
  IonText,IonItem,IonInput,IonModal,ModalController,IonCardContent,IonActionSheet,IonList,IonThumbnail,IonFab,IonFabButton,IonFabList,ToastController,IonCardTitle,IonCardSubtitle} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { TripService } from 'src/app/services/trip.service';
import { AuthService } from 'src/app/services/auth.service';
import { SignPage } from 'src/app/modals/sign/sign.page';
import { LoadingService } from 'src/app/services/loading.service';
import { addIcons } from 'ionicons';
import { calendarOutline, heartOutline, globeOutline, personAddOutline, trashOutline, shareOutline, close, addCircleOutline, sparklesOutline, ellipsisVertical } from 'ionicons/icons';
import { TitleCasePipe } from '@angular/common';
import { AiPlanPage } from 'src/app/modals/ai-plan/ai-plan.page';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-trips',
  templateUrl: 'trips.html',
  styleUrls: ['trips.scss'],
  standalone: true,
  providers: [TripService,ActionSheetController,ModalController],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonIcon, IonButton, IonLabel, 
    IonText,RouterLink,IonItem,IonInput,CommonModule,FormsModule,IonModal,IonCardContent,IonActionSheet,IonList,
    IonThumbnail,IonFab,IonFabButton,IonFabList,TitleCasePipe,IonCardHeader,IonCardTitle,IonCardSubtitle ],
})
export class Trips implements OnInit{
  tripName: string = '';
  trips: any[] = [];
  user: any;
  isModalOpen = false;
  loading = false;
  
  constructor(private router: Router, private modal: ModalController, private actionSheetCtrl: ActionSheetController, 
    private tripService: TripService, private authService: AuthService, private modalCtrl: ModalController, 
    private loadingService: LoadingService, private toastCtrl: ToastController) {
      this.loading = true;
      this.tripService.getTrips().subscribe((trips) => {
        this.trips = trips;
        this.loading = false;
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

  async ngOnInit() {
    try {
      this.user = await firstValueFrom(this.authService.currentUser$);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  async createTrip(tripName: string) {
    const trip = {
      name: tripName,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      imageUrl: 'assets/images/placeholderimg.png',
    };
    await this.tripService.addTrip(trip);
    this.modal.dismiss();
    await this.router.navigate(['/tabs/trips/trip-view', trip.name]);
    this.tripName = '';
  }

  async openTripOptions(event: Event, tripId: string) {
    event.stopPropagation();
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Trip options',
      cssClass: 'trip-action-sheet',
      buttons: [
        { text: 'Share', icon: 'share-outline', handler: () => {
          this.shareTrip(tripId);
        } },
        { text: 'Make public', icon: 'globe-outline', handler: () => {
          this.makePublic(tripId);
        } },
        { text: 'Invite', icon: 'person-add-outline', handler: () => {
          this.inviteToTrip(tripId);
        } }, 
        { text: 'Delete', icon: 'trash-outline', role: 'destructive', handler: () => {
          this.deleteTrip(tripId);
        } },
        { text: 'Edit', icon: 'pencil-outline', handler: () => {
        } },
        { text: 'Cancel', icon: 'close', role: 'cancel' }
      ]
    }); 
    await actionSheet.present();
  }

  async shareTrip(tripId: string) {    
    const url = `${window.location.origin}/tabs/trips/trip-view/${tripId}`;
    this.toastCtrl.create({
      message: 'Trip Url copied to clipboard',
      duration: 2000,
    }).then((toast) => {
      toast.present();
      navigator.clipboard.writeText(url);
    });
  }

  async makePublic(tripId: string) { 
    const trip = this.trips.find((t) => t._meta.id === tripId);
    this.tripService.updateTrip(trip, tripId, {
      isPublic: true,
    });
    this.trips = this.trips.map((t) => t._meta.id === tripId ? trip : t);
    this.toastCtrl.create({
      message: 'Trip made public',
      duration: 2000,
    }).then((toast) => {
      toast.present();
    });
  }

  async inviteToTrip(tripId: string) {
    this.toastCtrl.create({
      message: 'we are working for this feature',
      duration: 2000,
    }).then((toast) => {
      toast.present();
    });
  }

  async deleteTrip(tripId: string) { 
    await this.tripService.deleteTrip(tripId);
    this.trips = this.trips.filter((t) => t._meta.id !== tripId);
    this.toastCtrl.create({
      message: 'Trip deleted',
      duration: 2000,
    }).then((toast) => {
      toast.present();
    });
  }

  async editTrip(tripId: string, data: any) { 
    this.trips = this.trips.map((t) => t.id === tripId ? data : t);
    await this.tripService.updateTrip(data, tripId, data);
    this.toastCtrl.create({
      message: 'Trip edited',
      duration: 2000,
    }).then((toast) => {
      toast.present();
    });
  }

  openTrip(tripName: string) { 
    this.router.navigate(['/tabs/trips/trip-view', tripName]);
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

  async openAiPlan() {
    const modal = await this.modalCtrl.create({
      component: AiPlanPage,
      backdropBreakpoint: 1024,
    });
    modal.present();
  }
}
