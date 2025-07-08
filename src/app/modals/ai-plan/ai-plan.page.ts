import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ai-plan',
  templateUrl: './ai-plan.page.html',
  styleUrls: ['./ai-plan.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AiPlanPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
