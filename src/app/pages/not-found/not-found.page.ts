import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonContent} from '@ionic/angular/standalone';
import { DotLottie } from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, CommonModule,IonContent,IonButton],
  template: `
    <ion-content class="ion-padding">
      <div class="not-found-container">
        <canvas id="dotlottie-canvas" style="width: 100%; height: 60%;"></canvas>
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
export class NotFoundPage implements OnInit {
  dotLottie: DotLottie | null = null;
  constructor(private router: Router) {}

  ngOnInit() {
    const canvas = document.querySelector('#dotlottie-canvas') as HTMLCanvasElement;
    if (canvas) {
      this.dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        speed: 1,
        canvas: canvas,
        src: "https://lottie.host/1ca98d3c-de42-4f30-be33-0768d988047a/NLPnXR8QhI.lottie", // replace with your .lottie or .json file URL
      });
    }
  }

  goHome() {
    this.router.navigate(['/main/tabs/home']);
  }
} 