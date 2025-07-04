import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup , ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonButton, IonIcon, IonInput, 
  IonLabel, IonList, IonItem, IonTextarea, IonSearchbar,IonButtons,IonBackButton,ModalController } from '@ionic/angular/standalone';
import { CustomSearchPage } from 'src/app/modals/custom-search/custom-search.page';
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  providers:[ModalController],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonAvatar, IonButton, IonIcon, 
    IonInput, IonLabel, IonList, IonItem, IonTextarea, IonSearchbar,IonButtons,IonBackButton,ReactiveFormsModule]
})
export class EditProfilePage implements OnInit {
  selectedPlace: any;
  avatar: string = '';
  form: FormGroup;
  constructor(private modalCtrl: ModalController,private cdr:ChangeDetectorRef) {
    this.form = new FormGroup({
      name: new FormControl(''),
      currentCity: new FormControl(''),
      website: new FormControl(''),
      aboutYou: new FormControl('')
    });
   }


  ngOnInit() {
  }

  async openCustomSearch() {
    const modal = await this.modalCtrl.create({
      component: CustomSearchPage,
      componentProps: {
        fromPage: 'edit-profile'
      }
    })
    modal.present();
    const { data, role } = await modal.onWillDismiss()
    if (data && role === 'select') {
      this.selectedPlace = data;
      this.cdr.detectChanges();
    }
  }

  async uploadUserImage() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        direction: CameraDirection.Front
      });
      if (capturedPhoto.webPath) {
        this.avatar = capturedPhoto.webPath;
      }
      console.log(capturedPhoto.webPath);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  }

  save() {
    this.form.patchValue({
      currentCity: this.selectedPlace.name,
      name: this.form.value.name,
      website: this.form.value.website,
      aboutYou: this.form.value.aboutYou
    });
    console.log(this.form.value);
  }

}
