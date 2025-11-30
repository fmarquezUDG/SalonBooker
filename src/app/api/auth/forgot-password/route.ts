// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        nombre: true,
        email: true,
        activo: true
      }
    });

    if (!usuario || !usuario.activo) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña'
        },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetTokenExpires = new Date(Date.now() + 3600000);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        reset_password_token: resetTokenHash,
        reset_password_expires: resetTokenExpires
      }
    });

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    // Configurar transportador SMTP de IONOS
    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.mx',
      port: 587,
      secure: false, // true para 465, false para 587
      auth: {
        user: process.env.IONOS_EMAIL,
        pass: process.env.IONOS_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #9333ea; font-size: 32px; font-weight: bold;">
                        SalonBooker
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 20px 40px 40px 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">
                        Recuperación de contraseña
                      </h2>
                      
                      <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.5;">
                        Hola <strong>${usuario.nombre}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.5;">
                        Recibimos una solicitud para restablecer tu contraseña en SalonBooker.
                      </p>
                      
                      <p style="margin: 0 0 30px 0; color: #666; font-size: 16px; line-height: 1.5;">
                        Haz clic en el siguiente botón para crear una nueva contraseña:
                      </p>
                      
                      <!-- Button -->
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${resetUrl}" 
                               style="display: inline-block; 
                                      padding: 16px 32px; 
                                      background: linear-gradient(to right, #9333ea, #ec4899); 
                                      color: #ffffff; 
                                      text-decoration: none; 
                                      border-radius: 8px; 
                                      font-weight: bold;
                                      font-size: 16px;">
                              Restablecer mi contraseña
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 10px 0; color: #999; font-size: 14px; line-height: 1.5;">
                        O copia y pega este enlace en tu navegador:
                      </p>
                      
                      <p style="margin: 0 0 30px 0; padding: 15px; background-color: #f9f9f9; border-radius: 6px; word-break: break-all;">
                        <a href="${resetUrl}" style="color: #9333ea; text-decoration: none; font-size: 14px;">
                          ${resetUrl}
                        </a>
                      </p>
                      
                      <p style="margin: 0 0 10px 0; color: #e74c3c; font-size: 14px; line-height: 1.5;">
                        ⚠️ Este enlace expirará en 1 hora.
                      </p>
                      
                      <p style="margin: 0 0 30px 0; color: #999; font-size: 14px; line-height: 1.5;">
                        Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña permanecerá sin cambios.
                      </p>
                      
                      <!-- Divider -->
                      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;">
                      
                      <!-- Footer -->
                      <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.5;">
                        Saludos,<br>
                        <strong>El equipo de SalonBooker</strong>
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #ccc; font-size: 11px; line-height: 1.5;">
                        Este es un correo automático, por favor no respondas a este mensaje.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      console.log('🔄 Intentando enviar email con IONOS...');
      console.log('📧 Desde:', process.env.IONOS_EMAIL);
      console.log('📧 Para:', usuario.email);

      await transporter.sendMail({
        from: `SalonBooker <${process.env.IONOS_EMAIL}>`,
        to: usuario.email,
        subject: 'Recuperación de contraseña - SalonBooker',
        html: emailHtml,
        text: `Hola ${usuario.nombre},\n\nRecibimos una solicitud para restablecer tu contraseña.\n\nHaz clic en el siguiente enlace para crear una nueva contraseña:\n${resetUrl}\n\nEste enlace expirará en 1 hora.\n\nSi no solicitaste este cambio, puedes ignorar este correo.\n\nSaludos,\nEl equipo de SalonBooker`
      });

      console.log('✅ EMAIL ENVIADO EXITOSAMENTE');
      console.log('📧 Para:', usuario.email);
      console.log('👤 Usuario:', usuario.nombre);
      console.log('⏰ Token expira en: 1 hora');
      console.log('==================================');

    } catch (emailError) {
      console.error('❌ Error al enviar email:', emailError);
      const errorMessage = emailError instanceof Error ? emailError.message : 'Error desconocido';
      console.error('❌ Detalles:', errorMessage);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔗 Enlace de recuperación (usa este):', resetUrl);
      }
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña',
        ...(process.env.NODE_ENV === 'development' && { dev_reset_url: resetUrl })
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error general en forgot-password:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}