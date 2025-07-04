import { Injectable, NgZone } from '@angular/core';
import {
  Auth,
  EmailAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  PhoneAuthProvider,
  getAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  AuthStateChange,
  FirebaseAuthentication,
  GetIdTokenOptions,
  PhoneCodeSentEvent,
  PhoneVerificationCompletedEvent,
  PhoneVerificationFailedEvent,
  ProviderId,
  SignInResult,
  SignInWithPhoneNumberOptions,
  User,
} from '@capacitor-firebase/authentication';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { Observable, ReplaySubject, Subject, lastValueFrom, take } from 'rxjs';
import { FirebaseFirestoreService } from './firebase-firestore.service';
// import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
// import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';
import { environment } from '../../environments/environment';
import { PermissionLevel } from '../core/enums';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public auth: Auth;

  private currentUserSubject = new ReplaySubject<any>(1);
  private phoneAuthStateSubject = new Subject<string | null>();
  // private currentPhoneVerificationId: string;
  customId = null;
  constructor(
    private readonly firestoreService: FirebaseFirestoreService,
    private readonly ngZone: NgZone,
  ) {
    this.auth = getAuth();
    getAuth().onAuthStateChanged((user: any) => {
      this.ngZone.run(() => {
        this.currentUserSubject.next(this.createUserResult(user));
        if (user) {
          this.customId = user.reloadUserInfo?.customAttributes ? JSON.parse(user.reloadUserInfo.customAttributes)?.petId : null;
          this.updateUserIdToServices(user.uid);
        }
      });
    });

    getAuth().onIdTokenChanged((user: any) => {
      if (user) {
        this.customId = user.reloadUserInfo?.customAttributes ? JSON.parse(user.reloadUserInfo.customAttributes)?.petId : null;
      }
    })

    this.getCurrentAuthUser().then((user) => {
      if (!user) {
        const resultUser: any = this.createUserResult(getAuth().currentUser);
        if (resultUser) {
          this.currentUserSubject.next(resultUser);
        }
      }
    });

    this.clearAllListeners();
  }


  // async initialiseListerners() {
  //   await this.clearAllListeners();
  //   await FirebaseAuthentication.addListener('phoneCodeSent', async (event: PhoneCodeSentEvent) => {
  //     // Otp is sent. Let the user enter the SMS code
  //     this.currentPhoneVerificationId = event.verificationId;
  //     this.phoneAuthStateSubject.next('phoneCodeSent');
  //   });

  //   // await FirebaseAuthentication.addListener('phoneVerificationCompleted', async (event: PhoneVerificationCompletedEvent) => {
  //   //   this.phoneAuthStateSubject.next('phoneVerificationCompleted');
  //   // })

  //   await FirebaseAuthentication.addListener('phoneVerificationFailed', async (event: PhoneVerificationFailedEvent) => {
  //     this.phoneAuthStateSubject.next(event.message);
  //   })

  // }

  public async signInWithPhoneNumber(options: SignInWithPhoneNumberOptions) {
    await FirebaseAuthentication.signInWithPhoneNumber(options);
  }

  // public async confirmVerificationCode(code: string) {
  //   const credential = PhoneAuthProvider.credential(
  //     this.currentPhoneVerificationId,
  //     code,
  //   );
  //   await signInWithCredential(this.auth, credential);
  // }

  public get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
  public get phoneAuthState$(): Observable<string | null> {
    return this.phoneAuthStateSubject.asObservable();
  }

  public async getRedirectResult(): Promise<SignInResult | undefined> {
    if (Capacitor.isNativePlatform()) {
      return;
    }
    return FirebaseAuthentication.getRedirectResult();
  }


  public getCurrentAuthUser(): Promise<User | null> {
    return lastValueFrom(this.currentUser$.pipe(take(1)));
  }

  public async getIdToken(options?: GetIdTokenOptions): Promise<string> {
    const result = await FirebaseAuthentication.getIdToken(options);
    this.customId = JSON.parse(atob(result.token.split('.')[1]));
    return result.token;
  }

  public async setLanguageCode(languageCode: string): Promise<void> {
    await FirebaseAuthentication.setLanguageCode({ languageCode });
  }

  public async signInWithApple(): Promise<void> {
    // 1. Create credentials on the native layer
    const result = await FirebaseAuthentication.signInWithApple({
      scopes: ['email', 'name'],
      skipNativeAuth: true,
      customParameters: [{
        key: 'prompt',
        value: 'select_account'
      }]
    });

    // 2. Sign in on the web layer using the id token and nonce
    const provider = new OAuthProvider(ProviderId.APPLE);

    const credential = provider.credential({
      idToken: result.credential?.idToken,
      rawNonce: result.credential?.nonce
    });
    const auth = getAuth();
    await signInWithCredential(auth, credential);
  }

  public async signInWithFacebook(): Promise<void> {
    await FirebaseAuthentication.signInWithFacebook();
  }

  public async signInWithGithub(): Promise<void> {
    await FirebaseAuthentication.signInWithGithub();
  }

  public async signInWithGoogle(): Promise<void> {
    // 1. Create credentials on the native layer
    const result = await FirebaseAuthentication.signInWithGoogle({
      customParameters: [{
        key: 'prompt',
        value: 'select_account'
      }]
    });
    // 2. Sign in on the web layer using the id token
    const credential = GoogleAuthProvider.credential(
      result.credential?.idToken
    );
    const auth = getAuth();
    await signInWithCredential(auth, credential);
  }

  public async signInWithMicrosoft(): Promise<void> {
    await FirebaseAuthentication.signInWithMicrosoft();
  }

  public async signInWithPlayGames(): Promise<void> {
    await FirebaseAuthentication.signInWithPlayGames();
  }

  public async signInWithTwitter(): Promise<void> {
    await FirebaseAuthentication.signInWithTwitter();
  }

  public async signInWithYahoo(): Promise<void> {
    await FirebaseAuthentication.signInWithYahoo();
  }

  public async signInEmailAndPassword(e: string, p: string): Promise<void> {
    // 1. Create credentials on the native layer
    await FirebaseAuthentication.signInWithEmailAndPassword({
      email: e,
      password: p
    });
    // 2. Sign in on the web layer using the credential
    const credential = EmailAuthProvider.credential(e, p);
    await signInWithCredential(this.auth, credential);
  }

  public async signUpWithEmailAndPassword(e: string, p: string): Promise<void> {
    // 1. Create credentials on the native layer
    await FirebaseAuthentication.createUserWithEmailAndPassword({
      email: e,
      password: p,
    });
    // 2. Sign in on the web layer using the credential
    const credential = EmailAuthProvider.credential(e, p);
    await signInWithCredential(this.auth, credential);
  }

  public async webSignInWithEmailPassword(email: string, password: string) {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during web sign-in:', error);
    }
  }

  public async sendEmailLink(
    email: string,
    permissionLevel: PermissionLevel,
    animalId: string
  ) {
    await FirebaseAuthentication.sendSignInLinkToEmail({
      email,
      actionCodeSettings: {
        url: `${environment.appBaseUrl}login-passwordless?email=${email}&permissionLevel=${permissionLevel}&animalId=${animalId}`,
        handleCodeInApp: true,
        dynamicLinkDomain: 'd.pp.care',
        android: {
          packageName: 'dev.petparent.client',
          installApp: true,
        },
        iOS: {
          bundleId: 'dev.petparent.client',
        },
      },
    });
  }

  public async signInWithEmailLink(
    email: string,
    emailLink: string
  ): Promise<void> {
    const linkResult = await FirebaseAuthentication.isSignInWithEmailLink({
      emailLink,
    });

    if (linkResult.isSignInWithEmailLink) {
      const credential = EmailAuthProvider.credentialWithLink(email, emailLink);
      const auth = getAuth();
      await signInWithCredential(auth, credential);
    } else {
      throw new Error('Invalid link');
    }
  }

  public async signOut(): Promise<void> {
    // 1. Sign out on the native layer
    await FirebaseAuthentication.signOut();
    // 2. Sign out on the web layer
    const auth = getAuth();
    await signOut(auth);
  }

  public async useAppLanguage(): Promise<void> {
    await FirebaseAuthentication.useAppLanguage();
  }

  private createUserResult(user: any) {
    if (!user) {
      return null;
    } else {
      // return user;
      return {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl || user.photoURL,
        providerId: user.providerId,
        tenantId: user.tenantId,
        uid: user.uid,
      };
    }
  }

  async updateUserIdToServices(userId: string) {
    try {
      const deviceId = await Device.getId();
      const data: any = {
        user: this.firestoreService.getDocRef(`users/${userId}`),
      };

      const device = await this.firestoreService.getDocData(`devices/${deviceId.identifier}`);
      if (device) {
        // Since our logic relies on _meta.status, we should avoid using set with merge to prevent unintended overwrites.
        await this.firestoreService.update(
          `devices/${deviceId.identifier}`,
          data
        );
      } else {
        await this.firestoreService.setWithMerge(
          `devices/${deviceId.identifier}`,
          data
        );
      }

    } catch (error) {
    }

    try {
      // await FirebaseCrashlytics.setUserId({
      //   userId,
      // });
    } catch (error) {
    }
  }

  async clearAllListeners(): Promise<void> {
    await FirebaseAuthentication.removeAllListeners();
  }

}
