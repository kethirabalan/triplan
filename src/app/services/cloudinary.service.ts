import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private cloudName = environment.cloudinary.cloudName; 
  private uploadPreset = 'triplan';
  private apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File | Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post(this.apiUrl, formData);
  }

  getImageUrl(publicId: string, options: string = ''): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${options}/${publicId}`;
  }

  
} 