import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { getGoogleAuth } from 'src/common/google-auth';
import { ScheduleMeetingDto } from 'src/dto/schedule-meeting.dto';

@Injectable()
export class ScheduleMeetingService {
  async createMeeting(dto: ScheduleMeetingDto) {
    const auth = getGoogleAuth(dto.teacherEmail);
    const calendar = google.calendar({ version: 'v3', auth });

    const attendees = [
      { email: dto.teacherEmail }, // host/teacher
      ...dto.studentEmails.map(email => ({ email })),
    ];

    const event = await calendar.events.insert({
      calendarId: 'primary',
      sendUpdates: 'none',
      conferenceDataVersion: 1,
      requestBody: {
        summary: dto.summary,
        description: dto.description,
        start: {
          dateTime: dto.startTime,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: dto.endTime,
          timeZone: 'Asia/Kolkata',
        },
        visibility: 'private',
        attendees,
        conferenceData: {
          createRequest: {
            requestId: Date.now().toString(),
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false,
      },
    });

    return {
      meetLink: event.data?.hangoutLink,
      eventId: event.data?.id,
      status: 'Scheduled',
    };
  }
}
