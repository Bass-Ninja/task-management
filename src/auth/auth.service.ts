import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private configService: ConfigService) {}

    async createUser(authCredentials: AuthCredentialsDto) : Promise<void> {
        return this.usersRepository.createUser(authCredentials);

    }

    async signIn(authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentials;
        const user = await this.usersRepository.findOne({ where: { username } });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '3600s',
            });
            return { accessToken };
        } else {
            throw new UnauthorizedException("Wrong credentials");
        }
    }

}