import { getRepository, Repository } from 'typeorm';

import Token from '../../models/Token';
import ITokensRepository, { ICreateTokenData } from './base/ITokensRepository';

class TokensRepository implements ITokensRepository {
  private ormRepository: Repository<Token>;

  constructor() {
    this.ormRepository = getRepository(Token);
  }

  public async create(tokenData: ICreateTokenData): Promise<Token> {
    const token = this.ormRepository.create(tokenData);

    await this.ormRepository.save(token);

    return token;
  }

  public async save(token: Token): Promise<Token> {
    const savedToken = await this.ormRepository.save(token);

    return savedToken;
  }

  public async deleteById(id: string): Promise<Token> {
    const token = await this.ormRepository.findByIds([id]);

    await this.ormRepository.remove(token);

    return token[0];
  }

  public async deleteByUserId(userId: string): Promise<Token> {
    const token = this.ormRepository.findOne({ where: { user_id: userId } });

    await this.ormRepository.remove(token[0]);

    return token[0];
  }

  public async findById(id: string): Promise<Token | undefined> {
    const token = await this.ormRepository.findOne(id);

    return token;
  }

  public async findByUserId(userId: string): Promise<Token | undefined> {
    const token = this.ormRepository.findOne({ where: { user_id: userId } });

    return token;
  }
}

export default TokensRepository;
