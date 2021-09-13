import Token from '../../../models/Token';

export interface ICreateTokenData {
	value: string;
	user_id: string;
	expires_at: Date;
}

export default interface IUsersRepository {
  create(createTokenData: ICreateTokenData): Promise<Token>;

  save(token: Token): Promise<Token>;

  deleteById(id: string): Promise<Token | undefined>;

  deleteByUserId(id: string): Promise<Token | undefined>;

  findById(id: string): Promise<Token | undefined>;

  findByUserId(userId: string): Promise<Token | undefined>;
}
