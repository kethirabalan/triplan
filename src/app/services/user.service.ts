import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { take } from 'rxjs';
import { FirebaseFirestoreService } from './firebase-firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: any | null = null;
  constructor(private authService: AuthService,private firestoreService: FirebaseFirestoreService) {
  }

  async getCurrentUser() {
    return await this.authService.getCurrentAuthUser();
  }

  getCurrentUser$() {
    return this.authService.currentUser$.pipe(take(1));
  }

  async createOrUpdateUser(loginMethod: string, moreUserData: any, user?: any) {
    try {
      const currentUser = user || await this.getCurrentUser();
      
      if (currentUser) {
        const userRef = this.firestoreService.getDocRef(`users/${currentUser.uid}`);
        
        const userData: any = {
          loginMethod: loginMethod,
          moreUserData: moreUserData.moreUserData,
          createdAt: this.firestoreService.timestamp,
          updatedAt: this.firestoreService.timestamp
        };

        // Only add fields that have valid values (not null or undefined)
        if (currentUser.displayName) {
          userData.displayName = currentUser.displayName;
        }
        if (currentUser.email) {
          userData.email = currentUser.email;
        }
        
        // Check for photo URL with multiple possible property names
        const photoUrl = currentUser.photoUrl || currentUser.photoURL || currentUser.photo || null;
        if (photoUrl) {
          userData.photoURL = photoUrl;
        }
        
        // Remove any undefined values from the object before saving
        const cleanUserData: any = {};
        Object.keys(userData).forEach(key => {
          if (userData[key] !== undefined) {
            cleanUserData[key] = userData[key];
          }
        });
        
        await this.firestoreService.set(userRef.path, cleanUserData);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      throw error;
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
    if (user && user.email) {
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
      // Note: loginMethod is not a property of the User type, 
      // this method might need to be implemented differently
      return null;
    }
    return null;
  }

  async updateUserProfile(uid: string, userData: any) {
    try {
      const userRef = this.firestoreService.getDocRef(`users/${uid}`);
      
      // Get existing user data first
      const existingUser = await this.firestoreService.getDocData(userRef.path);
      
      // Merge existing data with new data
      const updatedUserData = {
        ...existingUser,
        ...userData,
        updatedAt: this.firestoreService.timestamp
      };
      
      // Remove any undefined values
      const cleanUserData: any = {};
      Object.keys(updatedUserData).forEach(key => {
        if (updatedUserData[key] !== undefined) {
          cleanUserData[key] = updatedUserData[key];
        }
      });
      
      await this.firestoreService.set(userRef.path, cleanUserData);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

}
