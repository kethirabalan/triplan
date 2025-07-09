import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, filter, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { dpr } from '@cloudinary/url-gen/actions/delivery';


@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  cloudinaryInstance: Cloudinary;

  constructor(private http: HttpClient) {
    this.cloudinaryInstance = new Cloudinary({
      cloud: {
        cloudName: environment.cloudinary.cloudName
      }
    })
  }


  // async uploadImage(file: any): Promise<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('upload', this.uploadPreset);
  //   return await this.http.post(this.apiUrl, formData).toPromise();
  // }

  // getImageUrl(publicId: string, options: string = ''): string {
  //   return `https://res.cloudinary.com/${this.cloudName}/image/upload/${options}/${publicId}`;
  // }

  uploadImage$(localFile: any, tags: string[] = []): Observable<any> {
    const formData = new FormData();
    formData.append('file', localFile);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    formData.append('folder', `${environment.cloudinary.folder}/images`);
    if (tags.length) {
      formData.append('tags', tags.join(','));  // Tags should be a comma-separated string
    }

    return this.http.post(environment.cloudinary.uploadEndpoint, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      filter((event: HttpEvent<any>) => event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
      map((event: HttpEvent<any>) => this.getEventMessage(event)),
      catchError(error => {
        console.error('Upload failed:', error);
        throw error;
      })
    );
  }

  async getImage(publicId: string, width?: number, height?: number, transformation?: string) {
    const cld = this.cloudinaryInstance.image(publicId)
    if (transformation) {
      cld.addTransformation(transformation + ',dpr_auto')
    } else {
      cld.resize(
        auto()
          .width(width || 'auto')
          .height(height || 'auto')
          .gravity('auto')
      ).delivery(dpr('auto'))
    }
    return cld.toURL()
  }


  private getEventMessage(event: HttpEvent<any>): any {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if (event.total) {
          return { progress: Math.round(100 * event.loaded / event.total) };
        }
        return { progress: 0 };
      case HttpEventType.Response:
        return { progress: 100, response: event.body };
      default:
        return { progress: 0 };
    }
  }

  
} 