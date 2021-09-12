interface IMailContact {
	name: string;
	email: string;
  }

export interface ISendMailData {
	to: IMailContact;
	from?: IMailContact;
	subject: string;
	htmlBody: string;
}

export default interface IMailProvider {
	sendMail(sendMailData: ISendMailData): Promise<void>;
}