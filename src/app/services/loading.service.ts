import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loaders: HTMLIonLoadingElement[] = []
  constructor(private loadingCtrl: LoadingController) { }

  async show(message = 'Loading...', opts?: LoadingOptions, minms?: number, msgInput?: any): Promise<HTMLIonLoadingElement> {
    const loader = await this.loadingCtrl.create({
      message: message,
      backdropDismiss: false,
      ...opts
    });
    this.loaders.push(loader)
    loader.present();
    if (minms) {
      await this.delay(minms);
    }
    return loader;
  }

  async dismiss(loader: HTMLIonLoadingElement, data?: any | undefined, role?: string | undefined): Promise<boolean> {
    return await loader.dismiss(data, role);
  }

  dismissAll(): boolean {
    try {
      this.loaders.forEach(async (l: HTMLIonLoadingElement) => await l.dismiss())
      return true;
    } catch (error) {
      return false;
    }
  }

  async delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showLoading(message = 'Loading...', opts?: LoadingOptions, minms?: number, msgInput?: any): Promise<HTMLIonLoadingElement> {
    return this.show(message, opts, minms, msgInput);
  }

  hideLoading(): boolean {
    return this.dismissAll();
  }
}
