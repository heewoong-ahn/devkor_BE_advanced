import { Controller, Get, UseGuards, Post, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('apple')
export class AppleController {
  @Get()
  @UseGuards(AuthGuard('apple'))
  async appleLogin() {}

  //apple에서 인증정보 받기위한 (authorization code, identity token) 콜백함수 endpoint
  //받은 정보 이용 apple 서버에 토큰 요청.
  @Post('/login')
  @UseGuards(AuthGuard('apple'))
  async appleCallBack(@Req() req) {
    //user는 validate에서 return하는 값을 지칭.
    return req.user;
  }
}
