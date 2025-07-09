// src/app/services/gemini.service.ts

import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI = new GoogleGenerativeAI(environment.geminiApi.key);

  constructor() { }

  async getTripPlaces(tripName: string): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Give me 10 popular tourist destinations in the ${tripName} in valid JSON format.
  
  Each item must include:
  - id
  - name
  - description
  - type (e.g. monument, temple, museum, nature, beach, city, etc.)
  - rating (between 4.0 and 5)
  - location (country or city)
  - image_query (exact name + location, used for image search)
  
  Only return a valid JSON array like this:
  [
    {
      "id": 1,
      "name": "Eiffel Tower",
      "description": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
      "type": "Monument",
      "rating": 4.8,
      "location": "Paris, France",
      "image_query": "Eiffel Tower Paris France"
    },
    ...
  ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    try {
      const jsonMatch = response.match(/\[.*\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
      console.error('Global Recommendation JSON parsing failed:', e);
      return [];
    }
  }

  async getItinerary(aiPlan: any): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Create a detailed ${aiPlan.tripLength}-day itinerary for a trip to ${aiPlan.destination.name} in ${aiPlan.month || 'any month'}, for ${aiPlan.companions}, focusing on: ${aiPlan.interests.join(', ')}. \nReturn a JSON array, each item must include: name, description, type, rating (4.0-5), location, image_query.`;
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    const jsonMatch = response.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  }

  async getGlobalRestaurants(): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Give me 10 popular restaurants in the world in valid JSON format.
    Each item must include:
    - id
    - name
    - type (e.g. restaurant, cafe, bar, etc.)
    - rating (between 4.0 and 5)
    - location (country or city)
    - image_query (exact name + location, used for image search)
    - mapUrl (google maps url)
    - latitude (latitude of the place)
    - longitude (longitude of the place)
    Return only raw JSON, do not wrap it in markdown.`;
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    const jsonMatch = response.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  }

  async getGlobalRecommendations(): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Give me 10 popular tourist destinations in the world in valid JSON format.
  
  Each item must include:
  - id
  - name
  - type (e.g. monument, temple, museum, nature, beach, city, etc.)
  - rating (between 4.0 and 5)
  - location (country or city)
  - image_query (exact name + location, used for image search)
  - mapUrl (google maps url)
  - latitude (latitude of the place)
  - longitude (longitude of the place)
  
  Only return a valid JSON array like this:
  [
   {
  "id": 1,
  "name": "Statue of Liberty",
  "type": "Monument",
  "rating": 4.7,
  "location": "New York, USA",
  "image_query": "Statue of Liberty New York USA",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=40.6892,-74.0445",
  "latitude": 40.6892,
  "longitude": -74.0445
  },
    ...
  ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    try {
      const jsonMatch = response.match(/\[.*\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
      console.error('Global Recommendation JSON parsing failed:', e);
      return [];
    }
  }

  async getGlobalPlaces(): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Give me 10 popular tourist destinations in the world in valid JSON format.
  
  Each item must include:
  - id
  - name
  - type (e.g. monument, temple, museum, nature, beach, city, etc.)
  - rating (between 4.0 and 5)
  - location (country or city)
  - image_query (exact name + location, used for image search)
  
  Only return a valid JSON array like this:
  [
    {
      "name": "Eiffel Tower",
      "type": "Monument",
      "rating": 4.8,
      "location": "Paris, France",
      "image_query": "Eiffel Tower Paris France",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=48.8584,2.3584"
    },
    ...
  ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    try {
      const jsonMatch = response.match(/\[.*\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
      console.error('Global Places JSON parsing failed:', e);
      return [];
    }
  }

  async getGlobalAdventure(): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Give me 10 popular **adventure travel destinations** in the world in valid JSON format.
    
  Each item must include:
  - id
  - name
  - type (e.g. trekking, scuba diving, bungee jumping, adventure park)
  - rating (between 4.0 and 5)
  - location (country or city)
  - image_query (exact name + location, used for image search)
  - mapUrl (google maps url)
  
  Only return a valid JSON array like this:
  [
    {
      "id": 1,
      "name": "Mount Kilimanjaro",
      "type": "Trekking",
      "rating": 4.9,
      "location": "Tanzania",
      "image_query": "Mount Kilimanjaro Tanzania",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=3.0695,37.3508"
    },
    ...
  ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    try {
      const jsonMatch = response.match(/\[.*\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
      console.error('Global Adventure JSON parsing failed:', e);
      return [];
    }
  }

  async getPlaceDetails(place: any): Promise<any> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Give me the details of the place ${place.name} in ${place.country} tourist places or adventure places only 3 place in valid JSON format.
  Each item must include:
  - id
  - name
  - type (e.g. monument, temple, museum, nature, beach, city, etc.)
  - rating (between 4.0 and 5)
  - location (country or city)
  - image_query (exact name + location, used for image search)
  Return only raw JSON, do not wrap it in markdown.`;

    try {
      const result = await model.generateContent(prompt);
      const rawText = await result.response.text();

      // Remove markdown backticks if present
      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Place Details JSON parsing failed:', e);
      return null;
    }
  }


}
