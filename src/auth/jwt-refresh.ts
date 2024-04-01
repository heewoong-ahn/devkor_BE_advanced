import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const cookie = req.cookies['refreshToken'];
          return cookie;
        },
      ]),
      secretOrKey: process.env.SECRET_KEY_REFRESH,
    });
  }
  validate(payload) {
    console.log(payload);
    return {
      email: payload.email,
      nickname: payload.sub,
    };
  }
}
