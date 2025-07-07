import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FirebaseFirestoreService } from './firebase-firestore.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TripService {
  constructor(
    private firestoreService: FirebaseFirestoreService,
    private authService: AuthService
  ) {}

  createId(): string {
    return this.firestoreService.createId();
  }

  addTrip(trip: any): Promise<any> {
    return this.authService.getCurrentAuthUser().then(user => {
      if (!user) throw new Error('No user signed in');
      const collectionPath = `users/${user.uid}/trips`;
      return this.firestoreService.add(collectionPath, trip);
    });
  }

  getTrips(): Observable<any[]> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const collectionPath = `users/${user.uid}/trips`;
        return this.firestoreService.col$(collectionPath).pipe(
          map(trips => trips.map((trip: any) => ({ ...trip }))),
          map(trips => trips.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()))
        );
      })
    );
  }

  deleteTrip(tripId: string): Promise<any> { 
    return this.authService.getCurrentAuthUser().then(user => {
      if (!user) throw new Error('No user signed in');
      const collectionPath = `users/${user.uid}/trips`;
      return this.firestoreService.delete(collectionPath, tripId);  
    });
  }

  updateTrip(trip: any, tripId: string, data: any): Promise<any> { 
    return this.authService.getCurrentAuthUser().then(user => {
      if (!user) throw new Error('No user signed in');
      const collectionPath = `users/${user.uid}/trips`;
      return this.firestoreService.update(collectionPath, tripId as any, data);
    });
  }
} 