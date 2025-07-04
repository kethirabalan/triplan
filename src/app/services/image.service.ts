import { Injectable } from '@angular/core';
import { FirebaseStorageService } from './firebase-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    private firebaseStorageService: FirebaseStorageService,
  ) { }

  getBlobFromWebPath(path: string): Promise<Blob> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest;
      xhr.responseType = 'blob';

      xhr.onload = () => {
        resolve(xhr.response as Blob);
      };

      xhr.open('GET', path);
      xhr.send();
    })

  }

  async getImageFile(file: any): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.log(error);
        resolve(null);
      };
    })
  }

  async uploadtoStorage(file: any, path: string): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          // const res = await this.firebaseStorageService.uploadBytes(path, file);
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      };
      reader.onerror = (error) => {
        resolve(false);
      };
    })
  }

}
