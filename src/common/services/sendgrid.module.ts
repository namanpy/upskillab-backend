import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './sendgrid.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class SendGridModule {}