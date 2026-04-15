import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    }

    async sendResetCode(email: string, code: string) {
        const from = this.configService.get<string>('MAIL_FROM') || 'onboarding@resend.dev';
        try {
            await this.resend.emails.send({
                from: from,
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
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw new InternalServerErrorException('Error al enviar el correo de recuperación');
        }
    }

    async sendRegistrationCode(email: string, code: string) {
        const from = this.configService.get<string>('MAIL_FROM') || 'onboarding@resend.dev';
        try {
            await this.resend.emails.send({
                from: from,
                to: email,
                subject: 'Código de Verificación - Magnolia Joyas',
                html: `
            <div style="font-family: 'Lato', sans-serif; color: #333333; max-width: 600px; margin: auto; border: 1px solid #D8C8D9; padding: 20px; border-radius: 8px;">
              <h1 style="font-family: 'Playfair Display', serif; color: #333333; text-align: center; border-bottom: 2px solid #C6D8C8; padding-bottom: 10px;">Magnolia Joyas</h1>
              <p style="font-size: 16px; line-height: 1.5;">Hola,</p>
              <p style="font-size: 16px; line-height: 1.5;">¡Gracias por registrarte en Magnolia Joyas! Utiliza el siguiente código para verificar tu correo electrónico:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #F9F9F9; padding: 10px 20px; border: 1px dashed #D8C8D9; border-radius: 4px; color: #D8C8D9;">${code}</span>
              </div>
              <p style="font-size: 14px; color: #666666;">Este código expirará en 15 minutos.</p>
              <hr style="border: 0; border-top: 1px solid #C6D8C8; margin: 20px 0;">
              <p style="text-align: center; font-size: 12px; color: #999999;">&copy; 2024 Magnolia Joyas. Joyas atemporales para nuevos comienzos.</p>
            </div>
          `,
            });
        } catch (error) {
            console.error('Error sending registration email:', error);
            throw new InternalServerErrorException('Error al enviar el correo de verificación');
        }
    }

    async sendAdminLoginCode(email: string, code: string) {
        const from = this.configService.get<string>('MAIL_FROM') || 'onboarding@resend.dev';
        try {
            await this.resend.emails.send({
                from: from,
                to: email,
                subject: 'Código de Acceso de Administrador - Magnolia Joyas',
                html: `
            <div style="font-family: 'Lato', sans-serif; color: #333333; max-width: 600px; margin: auto; border: 1px solid #D8C8D9; padding: 20px; border-radius: 8px;">
              <h1 style="font-family: 'Playfair Display', serif; color: #333333; text-align: center; border-bottom: 2px solid #C6D8C8; padding-bottom: 10px;">Magnolia Joyas</h1>
              <p style="font-size: 16px; line-height: 1.5;">Hola Administrador,</p>
              <p style="font-size: 16px; line-height: 1.5;">Se está intentando iniciar sesión en tu cuenta. Utiliza este código de verificación (2FA) para completar el proceso:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #F9F9F9; padding: 10px 20px; border: 1px dashed #D8C8D9; border-radius: 4px; color: #D8C8D9;">${code}</span>
              </div>
              <p style="font-size: 14px; color: #666666;">Este código expirará en 15 minutos.</p>
              <hr style="border: 0; border-top: 1px solid #C6D8C8; margin: 20px 0;">
              <p style="text-align: center; font-size: 12px; color: #999999;">&copy; 2024 Magnolia Joyas. Administración protegida.</p>
            </div>
          `,
            });
        } catch (error) {
            console.error('Error sending admin login email:', error);
            throw new InternalServerErrorException('Error al enviar el correo de acceso 2FA');
        }
    }
}
