import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly emailService: MailService) {}

  @Post()
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('html') html: string, // Add an HTML property to your request body
  ) {
    try {
      await this.emailService.sendEmail(to, subject, text, html);
      return { message: 'Email sent successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
