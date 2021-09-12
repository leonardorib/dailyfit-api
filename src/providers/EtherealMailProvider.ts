import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider, { ISendMailData } from './base/IMailProvider';
import mailConfig from "../config/mail";

export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  public async init() {
    try {
      const nodemailerTestAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: nodemailerTestAccount.smtp.host,
        port: nodemailerTestAccount.smtp.port,
        secure: nodemailerTestAccount.smtp.secure,
        auth: {
          user: nodemailerTestAccount.user,
          pass: nodemailerTestAccount.pass,
        },
      });

      this.client = transporter;
    } catch (e) {
      console.error('Error initializing nodemailer');
    } finally {
      return this;
    }
  }

  public async sendMail(sendMailData: ISendMailData) {
    if (!this.client) {
      throw new Error('Nodemailer client not initialized');
    }

    const { to, from: receivedFrom, subject, htmlBody } = sendMailData;

	const defaultFrom = mailConfig.from;

    const message = await this.client.sendMail({
      from: {
		  name: receivedFrom?.name || defaultFrom.name,
		  address: receivedFrom?.email || defaultFrom.email,
	  },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: htmlBody,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
