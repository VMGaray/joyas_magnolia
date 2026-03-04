import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });
    }

    async sendResetCode(email: string, code: string) {
        const mailOptions = {
            from: `"Magnolia Joyas" <${this.configService.get<string>('MAIL_FROM')}>`,
            to: email,
            subject: 'Código de recuperación de contraseña - Magnolia Joyas',
            html: `
        <div style="font-family: 'Lato', sans-serif; color: #333333; max-width: 600px; margin: auto; border: 1px solid #D8C8D9; padding: 20px; border-radius: 8px;">
          <h1 style="font-family: 'Playfair Display', serif; color: #333333; text-align: center; border-bottom: 2px solid #C6D8C8; padding-bottom: 10px;">Magnolia Joyas</h1>
          <p style="font-size: 16px; line-height: 1.5;">Hola,</p>
          <p style="font-size: 16px; line-height: 1.5;">Has solicitado restablecer tu contraseña. Utiliza el siguiente código de verificación para continuar con el proceso:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #F9F9F9; padding: 10px 20px; border: 1px dashed #D8C8D9; border-radius: 4px; color: #D8C8D9;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #666666;">Este código expirará en 15 minutos.</p>
          <p style="font-size: 16px; line-height: 1.5;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
          <hr style="border: 0; border-top: 1px solid #C6D8C8; margin: 20px 0;">
          <p style="text-align: center; font-size: 12px; color: #999999;">&copy; 2024 Magnolia Joyas. Joyas atemporales para nuevos comienzos.</p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new InternalServerErrorException('Error al enviar el correo de recuperación');
        }
    }
}
