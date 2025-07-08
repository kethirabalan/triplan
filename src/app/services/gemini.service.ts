// src/app/services/gemini.service.ts

import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI = new GoogleGenerativeAI(environment.geminiApi.key);

  constructor() {}

  async getTripPlaces(tripName: string): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
    const prompt = `Give me 10 popular tourist destinations in the ${tripName} in valid JSON format.
  
  Each item must include:
  - name
  - description
  - type (e.g. monument, temple, museum, nature, beach, city, etc.)
  - rating (between 4.0 and 5)
  - location (country or city)
  - image_query (exact name + location, used for image search)
  
  Only return a valid JSON array like this:
  [
    {
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

  async getGlobalRecommendations(): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
    const prompt = `Give me 5 popular tourist destinations in the world in valid JSON format.
  
  Each item must include:
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

  async getGlobalPlaces(): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
    const prompt = `Give me 10 popular tourist destinations in the world in valid JSON format.
  
  Each item must include:
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
      console.error('Global Places JSON parsing failed:', e);
      return [];
    }
  }

  async getGlobalAdventure(): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
    const prompt = `Give me 10 popular **adventure travel destinations** in the world in valid JSON format.
  
  Each item must include:
  - name
  - type (e.g. trekking, scuba diving, bungee jumping, adventure park)
  - rating (between 4.0 and 5)
  - location (country or city)
  - image_query (exact name + location, used for image search)
  
  Only return a valid JSON array like this:
  [
    {
      "name": "Mount Kilimanjaro",
      "type": "Trekking",
      "rating": 4.9,
      "location": "Tanzania",
      "image_query": "Mount Kilimanjaro Tanzania"
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
}
