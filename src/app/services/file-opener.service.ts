// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Globals } from '../core/global';
// import { Capacitor } from '@capacitor/core';
// import { FirebaseStorageService } from './firebase-storage.service';
// import write_blob from 'capacitor-blob-writer'
// import saveAs from 'file-saver';
// import { Directory, Filesystem } from '@capacitor/filesystem';
// import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';

// @Injectable() export class FileOpenerService {
//   current = Globals.current;
//   observationPathSubject = new BehaviorSubject<string | null>(null)
//   constructor(private firebaseStorageService: FirebaseStorageService) {
//   }


//   async previewImage(storagePath: string, filename: string, type?: string) {
//     const blob = await this.firebaseStorageService.getImageAsBlobOriginal(`${storagePath}/original`)
//     await this.previewBlob(blob, filename, type ? type : '')
//   }

//   async previewBlob(blob: Blob, filename: string, type?: string) {
//     if (!type) {
//       type = blob.type;
//     }
//     if (Capacitor.isNativePlatform()) {
//       const permissions = await this.getFilesystemAccess();
//       if (permissions) {
//         const extension: string | null = filename && filename.split('.')[1] || null;
//         await this.saveBlobFile(blob, extension);
//         await Filesystem.getUri({
//           path: extension ? 'original.' + extension : 'original',
//           directory: Directory.Cache,
//         })
//           .then(async (savedFile) => {
//             await this.openFileWithType(savedFile.uri, type)
//           })
//           .catch((error) => {
//             console.error(error)
//             throw new Error('Cannot save/open the file')
//           })
//       }
//     } else {
//       saveAs(blob, 'original');
//     }
//   }

//   private saveBlobFile(blob: Blob, extension: string | null) {
//     return write_blob({
//       path: extension ? 'original.' + extension : 'original',
//       directory: Directory.Cache,
//       blob: blob,
//     })
//   }

//   //  Open the file
//   async openFileWithType(filePath: string, fileType: string | undefined) {
//     const fileOpenerOptions: FileOpenerOptions = {
//       filePath: filePath,
//       contentType: fileType,
//     };

//     await FileOpener.open(fileOpenerOptions)
//       .then(() => {
//         // 'File is opened'
//       })
//       .catch((error) => {
//         console.error('fileopen failed', error);
//       });
//   }

//   getFilesystemAccess(): Promise<boolean> {
//     return new Promise(async (resolve) => {
//       const status = await Filesystem.checkPermissions()
//       const state = status.publicStorage

//       if (state === 'granted') {
//         return resolve(true)
//       } else if (state === 'denied') {
//         // ''
//       } else {
//         Filesystem.requestPermissions()
//       }
//       return resolve(false)
//     })

//   }

// }
