import * as crypto from "crypto";
import { addHours } from "date-fns";

import ITokensRepository from '../database/repositories/base/ITokensRepository';
import IUsersRepository from '../database/repositories/base/IUsersRepository';
import IMailProvider from "../providers/base/IMailProvider";
import AppError from '../errors/AppError';
import Token from '../models/Token';

interface IRequest {
  email: string;
}

interface IResponse {
	token: Token;
}

export default class GenerateForgotPasswordTokenService {
  private tokensRepository: ITokensRepository;
  private usersRepository: IUsersRepository;
  private mailProvider: IMailProvider;

  constructor(
    tokensRepository: ITokensRepository,
	usersRepository: IUsersRepository,
	mailProvider: IMailProvider,
  ) {
    this.tokensRepository = tokensRepository;
	this.usersRepository = usersRepository;
	this.mailProvider = mailProvider;
  }

  public async execute(request: IRequest): Promise<IResponse> {
    const { email } = request;

    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new AppError('User was not found', 404);
    };

	const alreadyRegisteredToken = await this.tokensRepository.findByUserId(user.id);

	const generatedToken = crypto.randomBytes(20).toString("hex");
	const oneHourFromNow = addHours(new Date(), 1);

	let newToken: Token;
	if (alreadyRegisteredToken) {
		newToken = await this.tokensRepository.save({
			...alreadyRegisteredToken,
			value: generatedToken,
			expires_at: oneHourFromNow,
		});
	} else {
		newToken = await this.tokensRepository.create({
			value: generatedToken,
			expires_at: oneHourFromNow,
			user_id: user.id,
		});
	}

	await this.mailProvider.sendMail({
		to: {
			name: `${user.first_name} ${user.last_name}`,
			email: user.email,
		},
		subject: "Dailyfit - Recuperação de senha",
		htmlBody: `<p>Olá, ${user.first_name}. Identificamos que você tentou recuperar sua senha no Dailyfit.</p>\n\n<p>Para continuar o processo, copie o <b>token</b> abaixo e utilize no aplicativo: </p>\n\n<h3>${newToken.value}</h3>\n\n<p>O token tem validade de 1 hora. Após este período você irá precisar gerar um novo caso deseje recuperar sua senha.</p>\n\n<p>Atenciosamente,</p>\n\n<p>Equipe Dailyfit</p>`
	})

	return {
		token: newToken,
	};
  }
}
