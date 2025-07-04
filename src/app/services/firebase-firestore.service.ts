import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  DocumentReference, disableNetwork, deleteField,
  enableNetwork, doc, Firestore, collection, query,
  QueryConstraint, DocumentData, Timestamp, setDoc, startAfter,
  updateDoc, deleteDoc, getCountFromServer,
  collectionData, docData, getDoc, getDocs, collectionGroup, WhereFilterOp,
  collectionSnapshots, where, docSnapshots, QueryOrderByConstraint, OrderByDirection, orderBy, FieldPath,
  QueryLimitConstraint, limit, QueryCompositeFilterConstraint, arrayUnion, arrayRemove, increment,
  QueryNonFilterConstraint
} from '@angular/fire/firestore';

import { Observable, catchError, combineLatest, debounceTime, firstValueFrom, map, of } from 'rxjs';
import { hash } from '../core/utils/cyrb53';
import { JSONPath } from 'jsonpath-plus';
import uniqueInArrayFilter, { uniqueInArrayBy } from '../core/utils/unique-in-array-filter';
import arrayCompare from '../core/utils/array-compare';
import { transformObject } from '../core/utils/transform-object';
import { noValue } from '../core/utils/no-value';
import { DocMetaStatus } from '../core/enums';
import { writeBatch } from "@angular/fire/firestore";
import { buildDocTree } from '../core/utils/doc-tree';

import { Globals } from "./../core/global";

export type FilterInput = [string, WhereFilterOp, (string | string[] | boolean | number | Date | DocumentReference | null)];

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
  constructor(private db: Firestore, private injector: Injector) {

  }

  get timestamp() {
    return Timestamp.now();

  }

  get getWriteBatch() {
    return writeBatch(this.db);
  }

  increment(n: number) {
    return increment(n)
  }

  createId(): string {
    return doc(collection(this.db, 'tmp')).id;
  }

  enableNetwork() {
    return enableNetwork(this.db);
  }

  disableNetwork() {
    return disableNetwork(this.db);
  }

  deleteField() {
    return deleteField();
  }

  arrayUnion(elements: any[]) {
    return arrayUnion(...elements);
  }

  arrayRemove(elements: any[]) {
    return arrayRemove(...elements);
  }

  newDocId(collectionPath: string): string {
    return doc(collection(this.db, collectionPath)).id;

  }

  getDocRef(documentPath: string): DocumentReference<DocumentData> {
    return runInInjectionContext(this.injector, () => doc(this.db, documentPath))

  }
  async getDocData(documentPath: string): Promise<DocumentData | undefined> {
    return runInInjectionContext(this.injector, async () => {
      const docRef = doc(this.db, documentPath);
      const snap = await getDoc(docRef);
      return snap.data()
    });
  }

  doc$(documentPath: string): Observable<DocumentData | undefined> {
    const docRef = runInInjectionContext(this.injector, () => doc(this.db, documentPath))
    return runInInjectionContext(this.injector, () => docData(docRef));
  }

  async getCol(collectionPath: string): Promise<DocumentData[] | []> {
    const colRef = collection(this.db, collectionPath)
    const queryDocData = query(colRef);
    const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(queryDocData));
    return querySnapshot.docs.map(doc => doc.data());

  }

  async getColWithRef(collectionPath: string): Promise<any[] | []> {
    const colRef = collection(this.db, collectionPath)
    const queryDocData = query(colRef);
    const querySnapshot = await getDocs(queryDocData);
    return querySnapshot.docs.map(doc => ({ ref: doc.ref, ...doc.data() }));

  }

  async getColGroupWithRef(collectionName: string): Promise<DocumentData[] | []> {
    const colGrpRef = collectionGroup(this.db, collectionName)
    const queryDocData = query(colGrpRef);
    const querySnapshot = await getDocs(queryDocData);
    return querySnapshot.docs.map(doc => ({ ref: doc.ref, ...doc.data() }));
  }

  async getColGroup(collectionName: string): Promise<DocumentData[] | []> {
    return runInInjectionContext(this.injector, async () => {
      const colGrpRef = collectionGroup(this.db, collectionName)
      const queryDocData = query(colGrpRef);
      const querySnapshot = await getDocs(queryDocData);
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getColOnQuery(collectionPath: string, queryConstraints: QueryConstraint[]): Promise<DocumentData[]> {
    return runInInjectionContext(this.injector, async () => {
      const colRef = collection(this.db, collectionPath);
      const queryDocData = query(colRef, ...queryConstraints);
      const querySnapshot = await getDocs(queryDocData);
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getFirstDoc(collectionPath: string, queryContraints: QueryConstraint[]): Promise<DocumentData | undefined> {
    const colRef = collection(this.db, collectionPath)
    const queryDocData = query(colRef, ...queryContraints);
    const querySnapshot = await getDocs(queryDocData);
    const docs = querySnapshot.docs.map(doc => doc.data());
    return docs.shift();
  }


  async getColOnQueryWithAndOr(collectionPath: string,
    queryContraints: QueryCompositeFilterConstraint, limit?: QueryLimitConstraint): Promise<DocumentData[] | []> {
    return runInInjectionContext(this.injector, async () => {
      const colRef = collection(this.db, collectionPath)
      const queryDocData = limit ? query(colRef, queryContraints, limit) : query(colRef, queryContraints);
      const querySnapshot = await getDocs(queryDocData);
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getColOnQueryWithAndOrOrderBy(collectionPath: string,
    queryContraints: QueryCompositeFilterConstraint, orderBy?: QueryOrderByConstraint): Promise<DocumentData[] | []> {
    return runInInjectionContext(this.injector, async () => {
      const colRef = collection(this.db, collectionPath)
      const queryDocData = orderBy ? query(colRef, queryContraints, orderBy) : query(colRef, queryContraints);
      const querySnapshot = await getDocs(queryDocData);
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getColGroupOnQuery(collectionName: string, queryContraints: QueryConstraint[]): Promise<DocumentData[] | []> {
    return runInInjectionContext(this.injector, async () => {
      const colGrpRef = collectionGroup(this.db, collectionName)
      const queryDocData = query(colGrpRef, ...queryContraints);
      const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(queryDocData));
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getColGroupOnQueryWithAndOr(collectionName: string,
    queryContraints: QueryCompositeFilterConstraint, limit?: QueryLimitConstraint): Promise<DocumentData[] | []> {
    return runInInjectionContext(this.injector, async () => {
      const colGrpRef = collectionGroup(this.db, collectionName)
      const queryDocData = limit ? query(colGrpRef, queryContraints, limit) : query(colGrpRef, queryContraints);
      const querySnapshot = await getDocs(queryDocData);
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getColGroupOnQueryWithAndOrOrderBy(collectionName: string,
    queryContraints: QueryCompositeFilterConstraint, orderBy?: QueryOrderByConstraint): Promise<DocumentData[] | []> {
    return runInInjectionContext(this.injector, async () => {
      const colGrpRef = collectionGroup(this.db, collectionName)
      const queryDocData = orderBy ? query(colGrpRef, queryContraints, orderBy) : query(colGrpRef, queryContraints);
      const querySnapshot = await getDocs(queryDocData);
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  async getColOnQueryWithCompositeAndNonFilter(collectionPath: string, queryCompositeFilterConstraint: QueryCompositeFilterConstraint,
    queryNonFilterConstraint: QueryNonFilterConstraint[]): Promise<DocumentData[]> {
    return runInInjectionContext(this.injector, async () => {
      const colRef = collection(this.db, collectionPath)
      const queryDocData = query(colRef, queryCompositeFilterConstraint, ...queryNonFilterConstraint);
      const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(queryDocData));
      return querySnapshot.docs.map(doc => doc.data());
    });
  }

  col$(collectionPath: string): Observable<DocumentData[]> {
    const colRef = collection(this.db, collectionPath)
    return runInInjectionContext(this.injector, () => collectionData(colRef).pipe(debounceTime(500)));
  }

  colOnQuery$(collectionPath: string, queryConstraints: QueryConstraint[]): Observable<DocumentData[]> {
    const colRef = collection(this.db, collectionPath)
    const queryDocData = runInInjectionContext(this.injector, () => query(colRef, ...queryConstraints));
    return runInInjectionContext(this.injector, () => collectionData(queryDocData).pipe(debounceTime(500)));
  }

  colGroupOnQuery$(collectionName: string, queryConstraints: QueryConstraint[]): Observable<DocumentData[]> {
    const colGrpRef = collectionGroup(this.db, collectionName)
    const queryDocData = query(colGrpRef, ...queryConstraints);
    return collectionData(queryDocData).pipe(debounceTime(500));
  }

  colOnQueryWithAndOr$(collectionPath: string, queryConstraints:
    QueryCompositeFilterConstraint, limit?: QueryLimitConstraint): Observable<DocumentData[]> {
    const colRef = collection(this.db, collectionPath)
    const queryDocData = limit ? query(colRef, queryConstraints, limit) : query(colRef, queryConstraints);
    return collectionData(queryDocData).pipe(debounceTime(500));
  }

  colOnQueryWithAndOrWithOrderBy$(collectionPath: string, queryConstraints:
    QueryCompositeFilterConstraint, orderBy?: QueryOrderByConstraint): Observable<DocumentData[]> {
    const colRef = collection(this.db, collectionPath);
    const queryDocData = orderBy ? query(colRef, queryConstraints, orderBy) : query(colRef, queryConstraints);
    return collectionData(queryDocData).pipe(debounceTime(500));
  }

  colOnQueryWithCompositeAndNonFilter$(collectionPath: string, queryCompositeFilterConstraint: QueryCompositeFilterConstraint,
    queryNonFilterConstraint: QueryNonFilterConstraint[]): Observable<DocumentData[]> {
    const colRef = collection(this.db, collectionPath)
    const queryDocData = query(colRef, queryCompositeFilterConstraint, ...queryNonFilterConstraint);
    return collectionData(queryDocData);
  }

  doc(path: string) {
    return doc(this.db, path);
  }

  collection(path: string) {
    return collection(this.db, path);
  }

  document$<T>(path: string): Observable<T | null> {
    return runInInjectionContext(this.injector, () =>
      docSnapshots(this.doc(path)).pipe(
        map((st: any) => {
          if (st.exists() === false) {
            return null;
          }
          const data = st.data() || {};
          return { ...data, _meta: data._meta || this.getDocMeta(st.ref.path) } as unknown as T;
        }),
        catchError(e => {
          console.error(path, e);
          return of(null);
        })
      )
    );
  }

  collection$<T>(path: string, q: FilterInput[] = [], o?: [c: string | FieldPath, d: OrderByDirection], s?: number): Observable<T[]> {
    return runInInjectionContext(this.injector, () => {
      const queryConstraints: QueryConstraint[] = q.map(
        (el) => where(el[0], el[1], el[2])
      );
      if (o) {
        queryConstraints.push(orderBy(...o));
      }
      if (s) {
        queryConstraints.push(limit(s));
      }
      const colRef = collection(this.db, path)
      let qr = query(colRef, ...queryConstraints);
// return collectionData(qr).pipe(debounceTime(500)) as Observable<T[]>;
      return collectionSnapshots(qr).pipe(
        map(st => st.map((el: any) => {
          const data = el.data() || {};
          return { ...data, _meta: data._meta || this.getDocMeta(el.ref.path) } as unknown as T;
        })),
        debounceTime(500),
      )
    });
  }

  collectionGroup$<T>(path: string, q: FilterInput[] = [], o?: [c: string | FieldPath, d: OrderByDirection], s?: number): Observable<T[]> {
    const queryConstraints: QueryConstraint[] = q.map(
      (el) => where(el[0], el[1], el[2])
    );
    if (o) {
      queryConstraints.push(orderBy(...o));
    }
    if (s) {
      queryConstraints.push(limit(s));
    }
    const queryDocs = collectionGroup(this.db, path)
    const qr = query(queryDocs, ...queryConstraints);

    return collectionSnapshots(qr).pipe(
      map(st => st.map((el: any) => {
        const data = el.data() || {};
        return { ...data, _meta: data._meta || this.getDocMeta(el.ref.path) } as unknown as T;
      })),
      debounceTime(500),
    )
  }

  async count(collectionPath: string,): Promise<number> {
    const colRef = collection(this.db, collectionPath);
    const snapshot = await getCountFromServer(colRef);
    return snapshot.data().count;
  }

  async countOnQuery(collectionPath: string, queryConstraints: QueryConstraint[]): Promise<number> {
    return runInInjectionContext(this.injector, async () => {
      const colRef = collection(this.db, collectionPath);
      const queryRef = query(colRef, ...queryConstraints);
      const snapshot = await getCountFromServer(queryRef);
      return snapshot.data().count;
    });
  }

  async countOnQueryWithAndOr(collectionPath: string, queryContraints:
    QueryCompositeFilterConstraint, limit?: QueryLimitConstraint): Promise<number> {
    return runInInjectionContext(this.injector, async () => {
      const colRef = collection(this.db, collectionPath);
      const queryRef = limit ? query(colRef, queryContraints, limit) : query(colRef, queryContraints);
      // const queryRef = query(colRef, ...queryConstraints);
      const snapshot = await getCountFromServer(queryRef);
      return snapshot.data().count;
    });
  }

  timestampFromDate(startDate: Date) {
    return Timestamp.fromDate(startDate);
  }

  timestampFromMillis(milliseconds: number) {
    return Timestamp.fromMillis(milliseconds);
  }



  private log(docRef: DocumentReference, _meta: any, data: any, log: any) {

    // We only log data under animals.
    if (!docRef.path.startsWith('animals')) {
      return;
    }

    const pet = Globals.current?.pet;
    const user = Globals.current?.user || null;
    if (pet) {
      const logDocRef = doc(collection(this.db, `${pet._meta.path}/logs`));
      const logMeta = this.getDocMeta(logDocRef.path);
      setDoc(logDocRef, {
        _meta: logMeta,
        _resourceMeta: {
          ..._meta,
          log,
          user: user ? this.getDocRef(user._meta.path) : null,
          type: 'add',
        },
        data,
      }).catch(e => console.log(e));
    }

  }

  async add(collectionPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(collection(this.db, collectionPath));
    const _meta = this.getDocMeta(docRef.path);
    await setDoc(docRef, {
      _meta,
      ...data,
    })
      .then(() => this.log(docRef, _meta, data, log));
    return docRef;
  }

  async set(documentPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(this.db, documentPath)
    const _meta = this.getDocMeta(docRef.path);
    await setDoc(docRef, {
      _meta,
      ...data,
    })
      .then(() => this.log(docRef, _meta, data, log));
    return docRef;
  }

  async setWithMerge(documentPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = runInInjectionContext(this.injector, () => doc(this.db, documentPath))
    const _meta = this.getDocMeta(docRef.path);
    await runInInjectionContext(this.injector, () => setDoc(docRef, {
      _meta,
      ...data,
    }, { merge: true }))
      .then(() => this.log(docRef, _meta, data, log));
    return docRef;
  }

  async update(documentPath: string, data: any, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(this.db, documentPath);
    await updateDoc(docRef, {
      ...data,
      '_meta.updatedAt': Timestamp.now(),
    })
      .then(() => this.log(docRef, this.getDocMeta(documentPath), data, log));
    return docRef;
  }

  async delete(documentPath: string, log: any = {}): Promise<DocumentReference> {
    const docRef = doc(this.db, documentPath)
    await deleteDoc(docRef)
      .then(() => this.log(docRef, this.getDocMeta(documentPath), {}, log));
    return docRef;
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


  async getItemsInBatch(collectionPath: string, batchSize: number, lastItem?: any): Promise<any[]> {
    // console.log('lastItem',lastItem)
    let q = query(collection(this.db, collectionPath), orderBy('_meta.createdAt', 'desc'), limit(batchSize));

    if (lastItem) {
      q = query(q, startAfter(await getDoc(lastItem)));
    }

    const querySnapshot = await getDocs(q);
    const items: any[] = [];
    querySnapshot.forEach(doc => {
      items.push(doc.data());
    });
    return items;
  }

  fetch(fetchConfigOrConfigs: FetchConfig | FetchConfig[], buildConfig?:
    { merge: boolean, onlyNamedProperties: boolean, build?: boolean }): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const configs = Array.isArray(fetchConfigOrConfigs) ? fetchConfigOrConfigs : [fetchConfigOrConfigs];

      const allData: Record<string, any> = {};
      const allPromises: Record<string, Promise<any>> = {};

      const requestData: {
        requested: string[],
        received: string[],
      } = {
        requested: [],
        received: [],
      }

      const r = (config: FetchConfig) => {

        const paths = Array.isArray(config.path) ? config.path : [config.path];
        if (!paths[0]) {
          console.log('NO PATHS', fetchConfigOrConfigs, config);
        }
        const isDocument = paths[0]?.split('/').length % 2 === 0;

        // Check if all paths is document or we have a single path that is collection.
        if (paths.length > 1) {
          for (const path of paths) {
            const isdoc = path?.split('/').length % 2 === 0;
            if (!isdoc) {
              throw new Error('if multiple paths are passed in they all have to be documents.');
            }
          }
        }



        const configId = hash(JSON.stringify(config));
        // console.log('CONFIG ID: ', configId);
        requestData.requested.push(configId.toString());

        if (!allPromises[configId]) {
          allPromises[configId] = isDocument ?
            (Array.isArray(config.path) ?
              firstValueFrom(combineLatest(paths.map(p => this.document$(p)))) :
              firstValueFrom(this.document$(paths[0]))
            ) :
            // NOTE: we do nnot support multiple paths for collections yet
            (paths[0].startsWith('**') ?
              (firstValueFrom(this.collectionGroup$(paths[0].replace('**', ''), config.filters, config.orderBy, config.limit))) :
              firstValueFrom(this.collection$(paths[0], config.filters, config.orderBy, config.limit))
            );
          // TODO: enable colleciton group queries. if path prefixed with **
        }

        allPromises[configId].then((dataOrArray) => {
          if (config.asNamedProperty) {
            allData[config.asNamedProperty] = dataOrArray;
          }
          const dataArray = Array.isArray(dataOrArray) ? dataOrArray : [dataOrArray];

          for (const data of dataArray) {
            if (!data) {
              continue
            }
            allData[data._meta.path] = data;

            if (config.withTranslations) {
              let newConfig = null;
              if (typeof config.withTranslations === 'string') {
                newConfig = { path: `${data._meta.path}/translations/${config.withTranslations}` };
              } else {
                newConfig = { path: `${data._meta.path}/translations` };
              }
              r(newConfig);
            }

            if (config.properties) {
              for (const prop of Object.keys(config.properties)) {
                const partialConfig = config.properties[prop];

                const propValue: DocumentReference | DocumentReference[] = JSONPath({ path: prop, json: data })[0];

                if (Array.isArray(propValue)) {
                  const paths = propValue.map(p => p?.path).filter(p => p);
                  if (paths.length) {
                    const newConfig: FetchConfig = { ...partialConfig, path: paths }
                    r(newConfig);
                  }
                } else {
                  if (propValue?.path) {
                    const newConfig: FetchConfig = { ...partialConfig, path: propValue.path }
                    r(newConfig);
                  }
                }
              }
            }

            if (config.subCollections) {
              for (const conf of config.subCollections) {
                const newConfig: FetchConfig = { ...conf, path: `${data._meta.path}/${conf.path}` };
                r(newConfig);
              }
            }
          }

          requestData.received.push(configId.toString());
          const filterredRequests = requestData.requested.filter(uniqueInArrayFilter);
          const filterredReceived = requestData.received.filter(uniqueInArrayFilter);
          const compare = arrayCompare(
            filterredRequests,
            filterredReceived
          );
          if (compare.isEqual) {

            if (!buildConfig?.merge) {
              if (buildConfig?.onlyNamedProperties) {
                const response = Object.keys(allData).reduce((acc, key) => {
                  if (key.split('/').length === 1) {
                    acc[key] = allData[key];
                  }
                  return acc;
                }, {} as Record<string, any>);
                resolve(response);

              } else {
                resolve({ ...allData });
              }

            } else {
              const arr = Object.values(allData)
                .filter(el => el)
                .filter(uniqueInArrayBy('$._meta.path'));

              let merged = arr.map((r: any) => {
                const newObj = transformObject(r, (v) => {
                  if (!noValue(v)) {
                    if (v && v.firestore && v._path) {
                      const obj = arr.find((s: any) => s._meta?.path === v.path);
                      return obj ? obj : v;
                    } else {
                      return v;
                    }
                  } else {
                    return null;
                  }
                });
                return Object.assign(r, newObj);
              });

              if (buildConfig.build) {
                merged = buildDocTree(merged, { childMapping: {} });
              }

              let response = Object.keys(allData).reduce((acc, key) => {
                if (Array.isArray(allData[key])) {
                  const paths = allData[key].map((d: any) => d._meta?.path);
                  const objs = merged.filter((s: any) => paths.includes(s._meta?.path));
                  acc[key] = objs;
                } else {
                  const path = allData[key]?._meta?.path;
                  const obj = merged.find((s: any) => s._meta?.path === path);
                  if (obj) {
                    acc[key] = obj;
                  } else {
                    acc[key] = null;
                  }
                }

                return acc;
              }, {} as Record<string, any>);

              if (buildConfig?.onlyNamedProperties) {
                response = Object.keys(response).reduce((acc, key) => {
                  if (key.split('/').length === 1) {
                    acc[key] = response[key];
                  }
                  return acc;
                }, {} as Record<string, any>);
                resolve(response);
              } else {
                resolve(response);
              }
            }
          }
        }).catch((e) => {
          console.error(config.path, e);
          reject(e);
        });

      };


      configs.forEach(c => r(c));
    });
  }

  clone(obj: any) {

    const fskeys = {
      ref: '$r=',
      tsp: '$t='
    };
    const toSerialisable = (data: any) => {
      const serializable = transformObject(data, (v) => {
        if (v || !isNaN(v)) {
          if (v && (typeof v.collection === 'function' || typeof v.firestore === 'object')) {
            return `${fskeys.ref}${v.path}`;
          } else if (v && typeof v.toDate === 'function') {
            return `${fskeys.tsp}${v.toDate().toISOString()}`;
          } else {
            return v;
          }
        } else {
          return null;
        }
      });
      return serializable;
    }

    const toFSData = (serializable: any) => {
      const data = transformObject(serializable, (v) => {
        if (v || !isNaN(v)) {
          if (typeof v === 'string') {
            if (v.substring(0, 3) === fskeys.ref) {
              return this.getDocRef(v.substring(3));
            } else if (v.substring(0, 3) === fskeys.tsp) {
              const milliseconds = Date.parse(v.substring(3));
              const seconds = Math.floor(milliseconds / 1000);
              const nanoseconds = (milliseconds % 1000) * 1_000_000;

              return new Timestamp(seconds, nanoseconds);
            } else {
              return v;
            }
          } else {
            return v;
          }
        } else {
          return v;
        }

      });
      return data;
    }
    return toFSData(toSerialisable(obj));

  }

}


export interface FetchConfig {
  path: string | string[];
  filters?: FilterInput[];
  orderBy?: [c: string | FieldPath, d: OrderByDirection],
  limit?: number,
  withTranslations?: boolean | string;
  properties?: { [key: string]: Partial<FetchConfig> };
  subCollections?: FetchConfig[];
  asNamedProperty?: string;
}