import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './dto/jwt-payload.interface';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        private readonly configService: ConfigService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<any>('JWT_SECRET'),
        });
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
