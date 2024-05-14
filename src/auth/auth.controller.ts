import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './request-interface';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Put('/createID')
  async codeVerification(@Body() body: { email: string; code: string }) {
    const user = await this.authService.findUserByEmail(body.email);
    const isCodeVerified = this.authService.compareCode(body.code, user.code);
    if (!isCodeVerified) {
      return {
        success: false,
        msg: '인증번호가 맞지 않거나 만료된 인증번호 입니다.',
      };
    }
    await this.authService.updateVerification(user);
    return { success: true, msg: '인증되었습니다.' };
  }

  @Post('/createID')
  async sendEmailAuth(@Body() body: CreateAuthDto) {
    const salt = await bcrypt.genSalt(10); //복잡도 10의 salt를 생성
    const hashedPassword = await bcrypt.hash(body.password, salt);

    body.password = hashedPassword;

    try {
      const user = this.authService.findUserByEmail(body.email);
      if (Object.keys(user).length !== 0) {
        return {
          success: false,
          message: '해당 이메일로 이미 아이디가 존재합니다.',
          user: user,
        };
      }
      const code = await this.authService.sendEmailAuth(body.email);
      await this.authService.createUser(body, code);
      return { success: true, message: '이메일이 성공적으로 전송되었습니다.' };
    } catch (error) {
      return { success: false, message: '이메일 전송 중 오류가 발생했습니다.' };
    }
  }

  @UseGuards(AuthGuard('access'))
  @Delete('/deleteID')
  async deleteUser(@Body() body: { email: string }) {
    await this.authService.deleteUser(body);
    return { success: true, message: `${body.email} 계정 탈퇴 되었습니다.` };
  }

  //인증번호 다시 보낼 때 사용: 시간 초과, 회원가입 이어서, 비밀번호 재설정
  @Post('/sendEmail')
  async sendEmailAuthAgain(@Body() body: { email: string }) {
    const code = await this.authService.sendEmailAuth(body.email);
    //해당 계정의 인증번호 초기화.
    await this.authService.createUser(body, code);
    return { success: true, message: '인증번호를 보내드렸습니다.' };
  }

  @UseGuards(AuthGuard('access'))
  @Put('/iniPassword')
  async initializePassword(@Body() body: { email: string; code: string }) {
    const user = await this.authService.findUserByEmail(body.email);
    const isCodeMatch = await this.authService.compareCode(
      body.code,
      user.code,
    );
    if (!isCodeMatch) {
      return { success: 'false', message: '인증번호가 일치하지 않습니다.' };
    }

    const salt = await bcrypt.genSalt(10); //복잡도 10의 salt를 생성
    const hashedPassword = await bcrypt.hash(
      process.env.INITIAL_PASSWORD,
      salt,
    );

    await this.authService.changePassword(user, hashedPassword);
    return { success: 'true', message: '비밀번호가 초기화 되었습니다.' };
  }

  @UseGuards(AuthGuard('access'))
  @Put('/changePassword')
  async changePassword(
    @Body()
    body: {
      email: string;
      password: string;
      newPassword: string;
      code: string;
    },
  ) {
    const user = await this.authService.findUserByEmail(body.email);
    const isPasswordMatch = await this.authService.comparePassword(
      body.password,
      user.password,
    );
    if (!isPasswordMatch) {
      return { success: 'false', message: '비밀번호가 일치하지 않습니다.' };
    }
    const isCodeMatch = await this.authService.compareCode(
      body.code,
      user.code,
    );
    if (!isCodeMatch) {
      return { success: 'false', message: '인증번호가 일치하지 않습니다.' };
    }
    const salt = await bcrypt.genSalt(10); //복잡도 10의 salt를 생성
    const hashedPassword = await bcrypt.hash(body.newPassword, salt);
    body.newPassword = hashedPassword;

    await this.authService.changePassword(user, body.newPassword);
    return { success: 'true', message: '비밀번호가 바뀌었습니다.' };
  }

  //Express Response를 사용해 응답을 http 응답을 할 때는,
  //res.status(200).json({}) 의 형식으로 답을 보낸다.
  @Post('/login')
  async authentication(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.findUserByEmail(body.email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: '아이디가 존재하지 않습니다.' });
    }

    const isPasswordMatch = await this.authService.comparePassword(
      body.password,
      user.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: '이메일 인증이 완료되지 않았습니다.',
      });
    }

    this.authService.setRefreshToken(user, res);

    const jwt = this.authService.getAccessToken(user);
    return res
      .status(200)
      .json({ success: true, message: '로그인 성공!', jwt: jwt });
  }

  @UseGuards(AuthGuard('access'))
  @Get('/testJWT')
  async test(@Req() req) {
    return {
      success: true,
      message: 'jwt인증이 확인되었습니다',
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('/newAccessToken')
  restoreAccessToken(@Req() req: RequestWithUser, @Res() res) {
    const newAccessToken = this.authService.getAccessToken({
      email: req.user.email,
      nickname: req.user.nickname,
    });
    return res.status(200).json({
      success: 'true',
      message: '새로운 access token이 발급 되었습니다.',
      user: req.user,
      jwt: newAccessToken,
    });
  }
  // restoreAccessToken(@Req() req) {
  //   return this.authService.getAccessToken({
  //     email: req.user.email,
  //     nickname: req.user.nickname,
  //   });
  // }
}
