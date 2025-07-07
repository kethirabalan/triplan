import { Injectable, Injector, runInInjectionContext, inject } from '@angular/core';
import {
  Firestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  DocumentReference,
  DocumentData,
  QueryConstraint,
  collectionData,
  query,
  collectionGroup,
  Timestamp,
  docData
} from '@angular/fire/firestore';
import { Observable, debounceTime } from 'rxjs';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {
  private db = inject(Firestore);
  private injector = inject(Injector);
  private storage = inject(Storage);

  get timestamp() {
    return Timestamp.now();
  }

  getWriteBatch() {
    return writeBatch(this.db);
  }

  createId(): string {
    return doc(collection(this.db, 'tmp')).id;
  }

  getDocRef(documentPath: string): DocumentReference<DocumentData> {
    return runInInjectionContext(this.injector, () => doc(this.db, documentPath));
  }

  async getDocData(documentPath: string): Promise<DocumentData | undefined> {
    return runInInjectionContext(this.injector, async () => {
      const docRef = doc(this.db, documentPath);
      const snap = await getDoc(docRef);
      return snap.data();
    });
  }

  doc$(documentPath: string): Observable<DocumentData | undefined> {
    const docRef = runInInjectionContext(this.injector, () => doc(this.db, documentPath));
    return runInInjectionContext(this.injector, () => docData(docRef));
  }

  async getCol(collectionPath: string): Promise<DocumentData[] | []> {
    const colRef = collection(this.db, collectionPath);
    const queryDocData = query(colRef);
    const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(queryDocData));
    return querySnapshot.docs.map(doc => doc.data());
  }

  async set(documentPath: string, data: any): Promise<DocumentReference> {
    const docRef = runInInjectionContext(this.injector, () => doc(this.db, documentPath));
    await setDoc(docRef, data);
    return docRef;
  }

  async update(documentPath: string, documentId: string, data: any): Promise<DocumentReference> {
    const docRef = runInInjectionContext(this.injector, () => doc(this.db, documentPath, documentId));
    await updateDoc(docRef, data);
    return docRef;
  }

  async delete(documentPath: string, documentId: string): Promise<DocumentReference> {
    const docRef = runInInjectionContext(this.injector, () => doc(this.db, documentPath, documentId));
    await deleteDoc(docRef);
    return docRef;
  }

  async add(collectionPath: string, data: any): Promise<DocumentReference> {
    const colRef = collection(this.db, collectionPath);
    const docRef = runInInjectionContext(this.injector, () => doc(colRef));
    await setDoc(docRef, data);
    return docRef;
  }

  col$(collectionPath: string): Observable<DocumentData[]> {
    const colRef = collection(this.db, collectionPath);
    return runInInjectionContext(this.injector, () => collectionData(colRef).pipe(debounceTime(500)));
  }

  async getColGroup(collectionName: string): Promise<DocumentData[] | []> {
    return runInInjectionContext(this.injector, async () => {
      const colGrpRef = collectionGroup(this.db, collectionName);
      const queryDocData = query(colGrpRef);
      const querySnapshot = await getDocs(queryDocData);
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getImageAsBlobOriginal(storagePath: string): Promise<Blob> {
    const storageRef = ref(this.storage, storagePath);
    const blob = await getDownloadURL(storageRef);
    return new Blob([blob], { type: 'image/jpeg' });
  }
}
