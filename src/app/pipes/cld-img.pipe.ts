import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { CloudinaryService } from '../services/cloudinary.service';

@Injectable({
  providedIn: 'root',
})

@Pipe({
  name: 'cldImg',
  standalone: true
})
export class CldImgPipe implements PipeTransform {

  constructor(private cloudinaryService: CloudinaryService) {
  }

  transform(publicId: string, transformation?: string): string { 
    if (!publicId || !publicId.startsWith('cs:')) {
      return '';
    }
  
    const publicIdSegments = publicId.split(':');
    const actualPublicId = publicIdSegments[1];
    const latestTransformation = transformation || publicIdSegments[2];
  
    const instance = this.cloudinaryService.cloudinaryInstance;
    const image = instance.image(actualPublicId);
  
    if (latestTransformation) {
      image.addTransformation(latestTransformation);
    }
  
    return image.toURL();
  }

}
