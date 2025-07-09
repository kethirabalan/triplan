// src/app/services/pixabay.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PixabayService {
  private API_KEY = environment.pixabay.key;
  private BASE_URL = 'https://pixabay.com/api/';

  constructor(private http: HttpClient) {}

  searchImage(query: string) {
    const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3&safesearch=true&order=popular`;
    return this.http.get<any>(url);
  }

  getImages(queries: string[]): Promise<any[]> {
    return Promise.all(queries.map(query => this.searchImage(query))).then(results => {
      const images = results.map((result: any) => {
        if (result.hits && result.hits.length > 0) {
          return result.hits;
        }
        return [];
      });
      return images;
    }).catch(error => {
      console.error('Error fetching images from Pixabay:', error);
      return queries.map(() => []); // Return empty arrays for failed requests
    });
  }
}
