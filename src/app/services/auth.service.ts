import { Injectable, NgZone, inject } from '@angular/core';
import { Auth, signInWithCredential, signInWithEmailAndPassword, signOut, GoogleAuthProvider, EmailAuthProvider, UserCredential, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';
import { Observable, ReplaySubject, firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private currentUserSubject = new ReplaySubject<User | null>(1);

  constructor(private ngZone: NgZone) {
    // Use the injected Auth instance for onAuthStateChanged
    this.auth.onAuthStateChanged((user: any) => {
      this.ngZone.run(() => {
        this.currentUserSubject.next(user);
      });
    });
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  async getCurrentAuthUser(): Promise<User | null> {
    return await firstValueFrom(this.currentUser$.pipe(take(1)));
  }

  async signInWithGoogle(): Promise<void> {
    // 1. Native sign-in
    const result = await FirebaseAuthentication.signInWithGoogle({
      customParameters: [{ key: 'prompt', value: 'select_account' }],
    });
    // 2. Web sign-in
    const credential = GoogleAuthProvider.credential(result.credential?.idToken);
    await signInWithCredential(this.auth, credential);
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUpWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();
    await signOut(this.auth);
  }

  async getIdToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No user signed in');
    return await user.getIdToken();
  }
}
