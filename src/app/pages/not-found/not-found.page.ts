import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonContent} from '@ionic/angular/standalone';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, CommonModule,IonContent,IonButton],
  template: `
    <ion-content class="ion-padding">
      <div class="not-found-container">
        <h1>404</h1>
        <p>Page not found</p>
        <ion-button (click)="goHome()">Go to home</ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
    }
    
    h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      color: var(--ion-color-primary);
    }
    
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: var(--ion-color-medium);
    }
  `]
})
export class NotFoundPage {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/main/tabs/home']);
  }
} 