import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: !!this.configService.get('SMTP_SECURE'),
      auth: {
        user: this.configService.get('SMTP_AUTH_USER'),
        pass: this.configService.get('SMTP_AUTH_PASS'),
      },
      debug: true,
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    const mailOptions = {
      from: 'Jayvee',
      to,
      subject,
      text,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
