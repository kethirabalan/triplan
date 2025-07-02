import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatboxOutline, heartOutline, homeOutline, personCircleOutline, searchOutline, notificationsOutline, locationOutline, 
  sparklesOutline, arrowForwardCircleOutline, heart, navigateOutline, 
  globe,airplane,add,pencilOutline,imageOutline,
  cameraOutline,cashOutline,settingsOutline,
  helpCircleOutline} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ homeOutline, searchOutline ,heartOutline, chatboxOutline, personCircleOutline, 
      notificationsOutline , locationOutline, sparklesOutline, arrowForwardCircleOutline, heart, 
      navigateOutline, globe,airplane, add, pencilOutline, imageOutline, cameraOutline,
      cashOutline,settingsOutline,helpCircleOutline});
  }
}
