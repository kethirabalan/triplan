import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  getMetadata, ref, StringFormat, UploadMetadata, UploadResult, uploadBytes, uploadString, uploadBytesResumable,
  UploadTask, getDownloadURL, getBlob, FullMetadata, Storage
} from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  // private storage = getStorage();
  constructor(private storage: Storage, private injector: Injector) { }

  getUri(path: string): string {
    return runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, `${path}original`);
      return storageRef.toString();
    });
  }

  async getThumbnailUrl(path: string, size: string, type?: any): Promise<string> {
    return await runInInjectionContext(this.injector, () => {
      let storageRef;
      if (type && (type === 'application/pdf' || type.includes('document'))) {
        storageRef = ref(this.storage, `${path}/original`);
      } else {
        storageRef = ref(this.storage, `${path}thumbs/original_${size}`);
      }
      return getDownloadURL(storageRef);
    });
  }

  async getAudioUrl(path: string): Promise<string> {
    return await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, path);
      return getDownloadURL(storageRef);
    });
  }

  async getStorageDownloadUrl(path: string): Promise<string> {
    return await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, path);
      return getDownloadURL(storageRef);
    })
  }

  async getImageAsBlob(path: string, size: string): Promise<Blob> {
    return await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, `${path}thumbs/original_${size}`);
      return getBlob(storageRef);
    })
  }

  async getImageAsBlobOriginal(path: string): Promise<Blob> {
    return await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, `${path}`);
      return getBlob(storageRef);
    })
  }

  async getMediaMetadata(path: string, size: string): Promise<FullMetadata> {
    return await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, `${path}thumbs/original_${size}`);
      return getMetadata(storageRef);
    })
  }

  async getImageAsBlobUrl(path: string, size: string): Promise<string> {
    const blob = await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, `${path}thumbs/original_${size}`);
      return getBlob(storageRef);
    })
    return URL.createObjectURL(blob);
  }

  async getOriginalImageAsBlobUrl(path: string): Promise<string> {
    const blob = await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, path);
      return getBlob(storageRef);
    })
      return URL.createObjectURL(blob);
  }

  //   https://firebase.google.com/docs/storage/web/upload-files

  async uploadString(path: string, value: string, format?: StringFormat | undefined, metadata?: UploadMetadata | undefined): Promise<UploadResult> {
    return await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, path);
      return uploadString(storageRef, value, format, metadata);
    })
  }

  async uploadBytes(path: string, data: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata | undefined): Promise<UploadResult> {
    return await runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, path);
      return uploadBytes(storageRef, data, metadata);
    })
  }


  uploadBytesResumable(path: string, data: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata | undefined): UploadTask {
    return runInInjectionContext(this.injector, () => {
      const storageRef = ref(this.storage, path);
      return uploadBytesResumable(storageRef, data, metadata);
    })
  }
}
