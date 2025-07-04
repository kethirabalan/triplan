import { DocumentReference } from "@angular/fire/firestore";

export interface Subscription {
    user: DocumentReference;
    userDisplayName: string;
    userEmail: string;
    platform: string;
    uuid: string;
    message: string;
    productId: string;
    subscriptionStatus: string;
    subscriptionDuration: string;
    purchase: {
        originalPurchaseDate: number;
        isAutoRenewing: boolean;
        purchaseOrderId: string;
        purchaseToken: number;
        id: number;
        productId: string;
        purchaseDate: number;
        purchaseStatus: string;
    };
    productDetails: {
        displayName: string;
        description: string;
        price: number;
        displayPrice: string;
        id: string;
    };
}

export interface AppInfo {
    version: string;
    build: any;
    deviceId: string;
}
