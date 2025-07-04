import { InjectionToken } from '@angular/core';

export interface EnvironmentConfig {
    production: boolean;
    appVersion: string;
    app: {
        chatServiceUrl: string;
    };
    firebase: {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId: string;
    };
}

export const ENV_CONFIG = new InjectionToken<EnvironmentConfig>('EnvironmentConfig');
