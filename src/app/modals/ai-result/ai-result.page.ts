import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton  } from '@ionic/angular/standalone';
import { GeminiService } from 'src/app/services/gemini.service';
import { PixabayService } from 'src/app/services/pixabay.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-result',
  templateUrl: './ai-result.page.html',
  styleUrls: ['./ai-result.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonSpinner, 
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,IonButton]
})
export class AiResultPage implements OnInit {
  aiPlan: any;
  itinerary: any[] = [];
  loading = true;
  images: { [key: string]: string } = {};

  constructor(
    private gemini: GeminiService,
    private pixabay: PixabayService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.aiPlan = window.history.state.aiPlan;
    if (!this.aiPlan) {
      this.router.navigate(['/tabs/trips']);
      return;
    }
    this.loading = true;
    try {
      // Use Gemini to generate itinerary for the selected city and preferences
      const prompt = this.buildPrompt();
      const model = (this.gemini as any).genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const jsonMatch = response.match(/\[.*\]/s);
      this.itinerary = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      // Fetch images for each day/attraction
      for (const day of this.itinerary) {
        const query = day.image_query || day.name;
        this.pixabay.searchImage(query).subscribe(res => {
          this.images[day.name] = res?.hits?.[0]?.largeImageURL || '';
        });
      }
    } catch (e) {
      this.itinerary = [];
    }
    this.loading = false;
  }

  buildPrompt() {
    const { destination, tripLength, month, companions, interests } = this.aiPlan;
    return `Create a detailed ${tripLength}-day itinerary for a trip to ${destination.name} in ${month || 'any month'}, for ${companions}, focusing on: ${interests.join(', ')}. 
Return a JSON array, each item must include: name, description, type, rating (4.0-5), location, image_query.`;
  }

  saveItinerary() {
    // Implement save logic or navigation
    this.router.navigate(['/tabs/trips']);
  }
}
