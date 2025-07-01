import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonImg,IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, IonCard, IonImg,IonIcon],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent  implements OnInit {
  @Input() items: any[] = [];
  @Input() adventureContent: any[] = [];
  @Input() cardWidth = '160px';
  @Input() cardHeight = '180px';
  @Input() iconKey: string = 'favorite';
  @Input() iconTrue: string = 'heart-fill';
  @Input() iconFalse: string = 'heart-outline';
  @Input() iconFunction: Function = () => {};

  constructor() { }

  ngOnInit() {
    this.adventureContent = this.adventureContent.map(item => ({
      ...item,
      [this.iconKey]: item[this.iconKey] ?? false
    }));
  }

  toggleFavorite(item: any) {
    item[this.iconKey] = !item[this.iconKey];
  
    if (this.iconFunction) {
      this.iconFunction(item);
    }
  }

}
