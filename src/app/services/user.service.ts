import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { take } from 'rxjs';

@Injectable()
export class UserService {
  currentUser: any | null = null;
  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentUser$() {
    return this.authService.currentUser$.pipe(take(1));
  }


}
