// src/schedule-meeting/schedule-meeting.service.ts
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as moment from 'moment';
import { getGoogleAuth } from 'src/common/google-auth';

@Injectable()
export class ScheduleMeetingService {
  async createMeeting(dto: any,teacherEmail: string) {
    const auth = getGoogleAuth(teacherEmail); 
    const calendar = google.calendar({ version: 'v3', auth });

    // Parse start and end time
    const startTime = moment(`${dto.date} ${dto.time}`, 'YYYY-MM-DD HH:mm');
    const endTime = moment(startTime).add(dto.duration, 'minutes');

    const attendees = [
      { email: dto.teacherEmail },
      ...dto.studentEmails.map((email: string) => ({ email })),
    ];

    const event = await calendar.events.insert({
      calendarId: 'primary',
      sendUpdates: 'all',
      conferenceDataVersion: 1,
      requestBody: {
        summary: dto.topic,
        description: `${dto.description}\nCourse: ${dto.courseName}\nChapter: ${dto.chapterName}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        visibility: 'private',
        attendees,
        conferenceData: {
          createRequest: {
            requestId: Date.now().toString(),
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false,
      },
    });

    return {
      meetLink: event.data?.hangoutLink,
      eventId: event.data?.id,
      ...event.data,
    };
  }
}
