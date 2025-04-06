import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YoutubeService {
  private readonly apiKey = 'YOUR_YOUTUBE_API_KEY'; // Replace with your API key
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private readonly httpService: HttpService) {}

  async getVideoDetails(videoId: string) {
    const url = `${this.baseUrl}/videos?part=player,snippet&id=${videoId}&key=${this.apiKey}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const video = response.data.items[0];
      if (!video) {
        throw new Error('Video not found');
      }
      return video;
    } catch (error) {
      throw new Error(`Failed to fetch video details: ${error.message}`);
    }
  }

  generateEmbedCode(videoId: string): string {
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?si=Rw0Rc4CXFYhaVtlg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  }

  generateShareLink(videoId: string, isLive = false): string {
    if (isLive) {
      return `https://www.youtube.com/live/${videoId}?si=-fkhKB84ilPGe_xL`;
    }
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}