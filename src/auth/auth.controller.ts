import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {LocalAuthGuard} from './jwt-auth.guard';

@Controller('auth')
export class AuthController {

constructor(private authService: AuthService) {}

    // @Get("/:id")
    // async getTaskById(@Param("id") id: string) : Promise<Task> {
    //     return await this.authService.getUserById(id);
    // }
    //

    @Post("signup")
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.authService.createUser(authCredentialsDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post("signin")
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return await this.authService.signIn(authCredentialsDto);
    }


}