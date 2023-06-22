import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';

@Module({
  providers: [SendMailService],
})
export class MailingModule {}
