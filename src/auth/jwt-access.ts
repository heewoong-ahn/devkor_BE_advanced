import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_ACCESS,
    });
  }
  validate(payload) {
    console.log(payload);
    return {
      id: payload.id,
      email: payload.email,
      nickname: payload.sub,
    };
  }
}
