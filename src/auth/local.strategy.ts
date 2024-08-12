import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './dto/jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private usersRepository: UsersRepository) {
        super();
    }

    async validate(payload: JwtPayload) : Promise<User> {
        const { username } = payload;
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}