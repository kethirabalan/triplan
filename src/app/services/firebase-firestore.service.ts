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
import { DocMetaStatus } from '../core/enums';

export type DocMeta = {
  id: string;
  path: string;
  cancelTrigger: boolean;
  status: DocMetaStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DocLike = {
  _meta: DocMeta;
}

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

  getDocMeta(documentPath: string) {
    const timestamp = Timestamp.now();
    let docRef: DocumentReference | null = runInInjectionContext(this.injector, () => doc(this.db, documentPath));
    const meta: any = {
      id: docRef.id,
      path: docRef.path,
      cancelTrigger: false,
      status: DocMetaStatus.Live,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    let count = 1;
    while (docRef && docRef.parent !== null) {
      if (docRef.parent.parent) {
        meta[`parent${count}`] = docRef.parent.parent.id;
        count++;
        docRef = docRef.parent.parent;
      } else {
        docRef = null;
      }
    }
    return meta;
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
  

  async add(collectionPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(collection(this.db, collectionPath));
    const _meta = this.getDocMeta(docRef.path);
    await setDoc(docRef, {
      _meta,
      ...data,
    })
    return docRef;
  }

  async set(documentPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(this.db, documentPath)
    const _meta = this.getDocMeta(docRef.path);
    await setDoc(docRef, {
      _meta,
      ...data,
    })
    return docRef;
  }

  async setWithMerge(documentPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = runInInjectionContext(this.injector, () => doc(this.db, documentPath))
    const _meta = this.getDocMeta(docRef.path);
    await runInInjectionContext(this.injector, () => setDoc(docRef, {
      _meta,
      ...data,
    }, { merge: true }))
    return docRef;
  }

  async update(documentPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(this.db, documentPath);
    await updateDoc(docRef, {
      ...data,
      '_meta.updatedAt': Timestamp.now(),
    })
    return docRef;
  }

  async delete(documentPath: string, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(this.db, documentPath)
    await deleteDoc(docRef)
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
