import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,) {}

    async createUser(authCredentials: AuthCredentialsDto) : Promise<void> {
        return this.usersRepository.createUser(authCredentials);
    }

    async signIn(authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentials;
        const user = await this.usersRepository.findOne({ where: { username } });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException("Wrong credentials");
        }
    }

}