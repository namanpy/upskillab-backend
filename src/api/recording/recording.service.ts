// // src/recording/recording.service.ts
// import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import { getGoogleAuth } from 'src/common/google-auth';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class RecordingService {
//   async fetchLatestRecording(teacherEmail: string): Promise<{ filePath: string; fileName: string }> {
//     const auth = getGoogleAuth(teacherEmail);
//     console.log(auth,"1")
//     const drive = google.drive({ version: 'v3', auth });
//     console.log(drive,"2")
//     const res = await drive.files.list({
//       q: "mimeType='video/mp4' and name contains 'Meet Recording'",
//       fields: 'files(id, name, createdTime)',
//       orderBy: 'createdTime desc',
//       pageSize: 1,
//     });
//     console.log(res,"3")

//     const file = res.data.files?.[0];
//     if (!file || !file.id || !file.name) {
//       throw new Error('No valid Meet recording file found');
//     }
// console.log(file,"4")
//     const destPath = path.join(__dirname, '../../temp', file.name);
//     const dest = fs.createWriteStream(destPath);

//     await drive.files.get(
//       { fileId: file.id, alt: 'media' },
//       { responseType: 'stream' },
//     ).then(res => {
//       return new Promise((resolve, reject) => {
//         res.data
//           .on('end', () => resolve(true))
//           .on('error', err => reject(err))
//           .pipe(dest);
//       });
//     });

//     return { filePath: destPath, fileName: file.name };
//   }
// }
