// // src/common/google-auth.ts
// import { google } from 'googleapis';
// import * as fs from 'fs';
// import * as path from 'path';

// const keyPath = path.join(__dirname, '../../ferrous-amphora-448210-u1-83e0f1104eff.json');
// const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));

// export function getGoogleAuth(subjectEmail: string) {
//   return new google.auth.JWT({
//     email: keyFile.client_email,
//     key: keyFile.private_key,
//     scopes: [
//       'https://www.googleapis.com/auth/calendar',
//       'https://www.googleapis.com/auth/drive.readonly',
//     ],
//     subject: subjectEmail,
//   });
// }
