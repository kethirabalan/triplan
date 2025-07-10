import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.triplan.app',
  appName: 'triplan',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Disable the native splash screen duration
      showSplashScreen: false // Optional, ensures native splash does not show
    }
  }
};

export default config;
