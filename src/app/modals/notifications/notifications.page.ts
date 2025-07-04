import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons, IonBackButton, IonIcon, ModalController, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonBackButton, IonIcon,IonButton]
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];
  isLoading: boolean = false;
  isRefreshing: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  hasMore: boolean = true;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
