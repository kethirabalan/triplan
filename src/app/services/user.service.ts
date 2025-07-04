import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { take } from 'rxjs';
import { FirebaseFirestoreService } from './firebase-firestore.service';

@Injectable()
export class UserService {
  currentUser: any | null = null;
  constructor(private authService: AuthService,private firestoreService: FirebaseFirestoreService) {
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentUser$() {
    return this.authService.currentUser$.pipe(take(1));
  }

  async createOrUpdateUser(loginMethod: string, moreUserData: any) {
    const user = await this.getCurrentUser();
    if (user) {
      const userRef = this.firestoreService.getDocRef(`users/${user.uid}`);
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        loginMethod: loginMethod,
        moreUserData: moreUserData,
        createdAt: this.firestoreService.timestamp,
        updatedAt: this.firestoreService.timestamp
      }
      await this.firestoreService.set(userRef.path, userData);
    }
  }

  async getUser(uid: string) {
    const userRef = this.firestoreService.getDocRef(`users/${uid}`);
    const user = await this.firestoreService.getDocData(userRef.path);
    return user;
  }

  async getUser$() {
    const user = await this.getCurrentUser();
    if (user) {
      return this.getUser(user.uid);
    }
    return null;
  }

  async getUserByEmail(email: string) {
    const userRef = this.firestoreService.getDocRef(`users/${email}`);
    const user = await this.firestoreService.getDocData(userRef.path);
    return user;
  }

  async getUserByEmail$() {
    const user = await this.getCurrentUser();
    if (user) {
      return this.getUserByEmail(user.email);
    }
    return null;
  }   

  async getUserByLoginMethod(loginMethod: string) {
    const userRef = this.firestoreService.getDocRef(`users/${loginMethod}`);
    const user = await this.firestoreService.getDocData(userRef.path);
    return user;
  }
  
  async getUserByLoginMethod$() {
    const user = await this.getCurrentUser();
    if (user) {
      return this.getUserByLoginMethod(user.loginMethod);
    }
    return null;
  }


}
