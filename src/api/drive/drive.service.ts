// src/drive/drive.service.ts
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { getGoogleAuth } from 'src/common/google-auth';

@Injectable()
export class DriveService {
  async listVideos(folderId: string) {
    const auth = getGoogleAuth(); // Your service account auth
    const drive = google.drive({ version: 'v3', auth });

    // 1️⃣ Get all video files in the folder
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/' and trashed=false`,
      fields: 'files(id, name, mimeType, createdTime)',
      orderBy: 'createdTime desc',
    });

    const files = res.data.files || [];

    return files.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      createdTime: file.createdTime,
      viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
      downloadUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, 
    }));
  }
}
