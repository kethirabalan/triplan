import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { DotLottie } from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {
  dotLottie: DotLottie | null = null;
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    const canvas = document.querySelector('#dotlottie-canvas') as HTMLCanvasElement;
    if (canvas) {
      this.dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvas,
        src: "https://lottie.host/7b0cd4a7-d1f6-4a5b-a207-abef358c6d81/TQbfgmAqcr.lottie", // replace with your .lottie or .json file URL
      });
    }
  }
  // https://lottie.host/13642399-f0ba-4f6a-826b-223af0b5ff58/FiYWCQg3Y3.lottie

  ionViewDidEnter() {
    setTimeout(() => {
      this.navCtrl.navigateRoot('/main'); // or your start route
    }, 6000); // Duration matches the animation
  }

}
