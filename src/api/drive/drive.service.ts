import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { getGoogleAuth } from 'src/common/google-auth';

@Injectable()
export class DriveService {
  async listVideos(folderId: string) {
    const auth = getGoogleAuth(); // No subject needed for Drive
    const drive = google.drive({ version: 'v3', auth });

    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/' and trashed=false`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime)',
      orderBy: 'createdTime desc',
    });

    return res.data.files || [];
  }
}
