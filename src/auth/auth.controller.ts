import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

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

    @Post("signin")
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return await this.authService.signIn(authCredentialsDto);
    }


}