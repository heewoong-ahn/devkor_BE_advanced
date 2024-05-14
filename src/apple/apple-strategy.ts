import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string;
}

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      callbackURL: process.env.APPLE_CALLBACK_URL,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      scope: ['name', 'email'],
      //validate 콜백함수로 req를 인자로 넘길 것인지 여부.
      passReqToCallback: false,
    });
  }

  async validate(idToken: string, profile: any): Promise<any> {
    const decodedToken = jwtDecode(idToken) as JwtPayload;
    return {
      //idToken: idToken,
      //idToken을 decode해서 유저 정보를 가져와야하지만 (email만을 포함한다고 써 있음), profile도 제공을 해서 따로 decode할 필요 없는듯.
      //profile로 정보가 안넘어오면 idToken decode해서 사용해야함. 'jwt.decode(idToken)'
      //profile정보는 처음 request에만 제공하고 그 후에는 제공을 안한다?
      //   name: profile.name || '',
      //   email: profile.email,
      email: decodedToken.email,
    };
  }
}
