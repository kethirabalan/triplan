import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
  imports: [CommonModule,IonIcon],
})
export class ComingSoonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
