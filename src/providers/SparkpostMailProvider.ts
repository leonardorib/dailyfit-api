import Sparkpost from 'sparkpost';
import IMailProvider, { ISendMailData } from './base/IMailProvider';
import mailConfig from "../config/mail";

export default class SparkpostMailProvider implements IMailProvider {
  private client: Sparkpost;

  constructor() {
    this.client = new Sparkpost(process.env.SPARKPOST_API_KEY);
  }

  public async sendMail(sendMailData: ISendMailData) {
    if (!this.client) {
      throw new Error('Sparkpost client not initialized');
    }

    const { to, from: receivedFrom, subject, htmlBody } = sendMailData;

    const defaultFrom = mailConfig.from;

    await this.client.transmissions.send({
      content: {
		from: {
			name: receivedFrom?.name || defaultFrom.name,
			email: receivedFrom?.email || defaultFrom.email,
		  },
        subject,
        html: htmlBody,
      },
      recipients: [{ address: to.email }],
    });
  }
}
