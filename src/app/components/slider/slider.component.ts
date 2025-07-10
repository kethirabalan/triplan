import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonImg,IonIcon,IonButton, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, IonCard, IonImg,IonIcon, IonButton],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent  implements OnInit {
  @Input() items: any[] = [];
  @Input() adventureContent: any[] = [];
  @Input() customCard: any[] = [];
  @Input() cardWidth = '160px';
  @Input() cardHeight = '180px';
  @Input() cardMargin = '0px';
  @Input() cardBorderRadius = '0px';
  @Input() iconKey: string = 'favorite';
  @Input() iconTrue: string = 'heart-fill';
  @Input() iconFalse: string = 'heart-outline';
  @Input() iconFunction: Function = () => {};
  @Output() itemClick = new EventEmitter<any>();
  user: any;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) { 
    
  }
  
  async ngOnInit() {
    this.user = await firstValueFrom(this.authService.currentUser$);
    this.adventureContent = this.adventureContent.map(item => ({
      ...item,
      [this.iconKey]: item[this.iconKey] ?? false
    }));
  }
  
  onItemClick(item: any) {
    if(!this.user) {
      this.toastController.create({
        message: 'Please sign in to view this place',
        duration: 2000,
        color: 'primary'
      }).then(toast => toast.present());
      return;
    }
    this.itemClick.emit(item);
    this.router.navigate(['/tabs/home/view-place'], { state: { item: item } });
  }

  recommendationClick(item: any) {
    if(!this.user) {
      this.toastController.create({
        message: 'Please sign in to view this place',
        duration: 2000,
        color: 'primary'
      }).then(toast => toast.present());
      return;
    }
    this.router.navigate(['/tabs/home/view-recommendation'], { state: { item: item } });
  }

  toggleFavorite(item: any) {
    item[this.iconKey] = !item[this.iconKey];
  
    if (this.iconFunction) {
      this.iconFunction(item);
    }
  }

}
