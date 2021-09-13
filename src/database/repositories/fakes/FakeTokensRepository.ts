import { v4 as uuid } from 'uuid';
import Token from '../../../models/Token';
import ITokensRepository, { ICreateTokenData } from '../base/ITokensRepository';

class FakeTokensRepository implements ITokensRepository {
  private tokens: Token[];

  constructor() {
    this.tokens = [];
  }

  public async create(tokenData: ICreateTokenData): Promise<Token> {
    const token = new Token();

    Object.assign(token, { id: uuid() }, { ...tokenData });

    this.tokens.push(token);

    return token;
  }

  public async save(token: Token): Promise<Token> {
    const tokenIndex = this.tokens.findIndex(
      (tokenInRepo) => tokenInRepo.id === token.id
    );

    this.tokens[tokenIndex] = token;

    return this.tokens[tokenIndex];
  }

  public async findById(id: string): Promise<Token | undefined> {
    const token = this.tokens.find((token) => token.id === id);

    return token;
  }

  public async findByUserId(userId: string): Promise<Token | undefined> {
    const token = this.tokens.find((token) => token.user_id === userId);

    return token;
  }

  public async deleteById(id: string): Promise<Token> {
    const tokenFound = this.tokens.find((token) => token.id === id);

    this.tokens = this.tokens.filter((token) => token.id !== id);

    return tokenFound;
  }

  public async deleteByUserId(userId: string): Promise<Token> {
    const tokenFound = this.tokens.find((token) => token.user_id === userId);

    this.tokens = this.tokens.filter((token) => token.user_id !== userId);

    return tokenFound;
  }
}

export default FakeTokensRepository;
