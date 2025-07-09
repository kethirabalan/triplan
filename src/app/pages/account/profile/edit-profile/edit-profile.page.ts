import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup , ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonButton, IonIcon, IonInput, 
  IonLabel, IonList, IonItem, IonTextarea, IonSearchbar,IonButtons,IonBackButton,ModalController, IonImg, 
  IonToast, ToastController } from '@ionic/angular/standalone';
import { CustomSearchPage } from 'src/app/modals/custom-search/custom-search.page';
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { LoadingService } from 'src/app/services/loading.service';
import { firstValueFrom } from 'rxjs';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { CldImgPipe } from 'src/app/pipes/cld-img.pipe';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  providers:[ModalController],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonAvatar, IonButton, IonIcon, 
    IonInput, IonLabel, IonList, IonItem, IonTextarea, IonSearchbar,IonButtons,IonBackButton,ReactiveFormsModule,
    IonImg, IonToast, CldImgPipe]
})
export class EditProfilePage implements OnInit {
  selectedPlace: any;
  avatar: any;
  form: FormGroup;
  currentUser: any;
  userData: any;
  
  constructor(
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private toastController: ToastController,
    private cloudinaryService: CloudinaryService
  ) {
    this.form = new FormGroup({
      name: new FormControl(''),
      currentCity: new FormControl(''),
      website: new FormControl(''),
      aboutYou: new FormControl('')
    });
  }


  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      const loader = await this.loadingService.show('Loading profile...');
      
      // Get current authenticated user
      this.currentUser = await firstValueFrom(this.authService.currentUser$);
      
      if (this.currentUser) {
        // Get user data from Firestore
        this.userData = await this.userService.getUser(this.currentUser.uid);
        
        if (this.userData) {
          // Set avatar from user data
          this.avatar = this.userData.photoURL || this.currentUser.photoUrl || '';
          
          // Set selected place if exists
          if (this.userData.currentCity) {
            this.selectedPlace = { name: this.userData.currentCity };
          }
          
          // Populate form with existing data
          this.form.patchValue({
            name: this.userData.displayName || this.currentUser?.displayName || this.currentUser?.email.split('@')[0] || '',
            currentCity: this.userData.currentCity || '',
            website: this.userData.website || '',
            aboutYou: this.userData.aboutYou || ''
          });
        } else {
          // If no user data in Firestore, use auth user data
          this.avatar = this.currentUser.photoUrl || '';
          this.form.patchValue({
            name: this.currentUser?.displayName || this.currentUser?.email.split('@')[0] || '',
            currentCity: '',
            website: '',
            aboutYou: ''
          });
        }
      }
      
      await this.loadingService.dismiss(loader);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading user data:', error);
      await this.loadingService.dismissAll();
    }
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
        // Convert webPath to Blob
        const response = await fetch(capturedPhoto.webPath);
        const blob = await response.blob();  
        // Upload the Blob to Cloudinary
         this.cloudinaryService.uploadImage$(blob, ['user-avatar']).subscribe({
          next: async (uploadEvent: any) => {
            const cloudinaryRes = uploadEvent.response;
            const publicId = cloudinaryRes?.public_id;
            if (cloudinaryRes && cloudinaryRes.secure_url) {
              this.avatar = cloudinaryRes.secure_url;
              this.cdr.detectChanges();
            
              if (this.currentUser && publicId) {
                const csPath = 'cs:' + publicId;
                await this.userService.updateUserProfile(this.currentUser.uid, {
                  photoURL: csPath
                });
              }

              
            }
          },
          error: (err) => {
            console.error('Upload failed:', err);
          }
        });
      }
    } catch (error) {
      console.error('Camera error or upload failure:', error);
    }
  }
 

  async save() {
    try {
      const loader = await this.loadingService.show('Saving profile...');
      
      // Update form with selected place
      if (this.selectedPlace) {
        this.form.patchValue({
          currentCity: this.selectedPlace.name
        });
      }
      
      const formData = this.form.value;
      
      // Prepare user data to save
      const userDataToSave = {
        displayName: formData.name,
        currentCity: formData.currentCity,
        website: formData.website,
        aboutYou: formData.aboutYou,
        photoURL: this.avatar,
        updatedAt: this.userService['firestoreService'].timestamp
      };
      
      // Save to user collection
      if (this.currentUser) {
        await this.userService.updateUserProfile(this.currentUser.uid, userDataToSave);
        
        await this.loadingService.dismiss(loader);
        this.showToast('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      await this.loadingService.dismissAll();
      this.showToast('Error saving profile. Please try again.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'medium'
    });
    await toast.present();
  }

}
