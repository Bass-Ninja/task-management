import { Repository } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
        super(
            usersRepository.target,
            usersRepository.manager,
            usersRepository.queryRunner,
        );
    }

    async createUser(authCredentials: AuthCredentialsDto) : Promise<void> {
        const { username, password } = authCredentials;
        //hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({username, password: hashedPassword});
        try {
            await this.save(user);
        } catch (error) {
            if (error.code === "23505") {
                throw new ConflictException('Username already exists.')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

}