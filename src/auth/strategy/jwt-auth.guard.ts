import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private configService: ConfigService,) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            request['user'] = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch (error) {
            console.error('JWT verification error:', error.message);
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | null {
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            return null;
        }
        const [, token] = authorizationHeader.split(' ');
        return token || null;
    }
}