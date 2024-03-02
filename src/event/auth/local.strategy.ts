import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "passport-local";
import { User } from "./user.entity";
import { Repository } from "typeorm";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    let user = await this.userRepository.findOne({ where: { username } });
    if(!user){
        this.logger.error(`User ${username} not found`);
        throw new UnauthorizedException();


    }
    if(user.password !== password){
        this.logger.error(`Password is not correct`);
        this.logger.debug(`Invalid credentials for user ${username}`);
        throw new UnauthorizedException();

    }

    return user;

  }
}