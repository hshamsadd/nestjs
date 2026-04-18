import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
    });
  }

  async validate(payload: any) {
    try {
      const user = this.authService.getUserById(payload.id);
      return {
        ...user,
        role: payload.role, // to check if user is normal or admin user
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
