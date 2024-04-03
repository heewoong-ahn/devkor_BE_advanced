import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}
  private readonly uuidExpire: Map<string, { expiresAt: Date }> = new Map();

  async createEmailCode() {
    const uuid = uuidv4().substring(0, 6);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    this.uuidExpire.set(uuid, { expiresAt });
    return uuid;
  }

  async sendEmailAuth(email: string): Promise<string> {
    const code = await this.createEmailCode();

    await this.mailerService.sendMail({
      to: email,
      subject: '인증번호',
      text: `${code}`,
    });

    return code;
  }

  async createUser(authData: Partial<Auth>, code: string) {
    const existingUser = await this.findUserByEmail(authData.email);
    if (existingUser) {
      existingUser.code = code;
      return await this.authRepository.save(existingUser);
    }
    const newUser = this.authRepository.create({ ...authData, code });
    return await this.authRepository.save(newUser);
  }

  async changePassword(authData: Auth, newPassword: string) {
    authData.password = newPassword;
    return await this.authRepository.save(authData);
  }

  async findUserByEmail(email: string): Promise<Auth> {
    return await this.authRepository.findOne({ where: { email } });
    //해당 이메일에 해당하는 auth객체 반환
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  compareCode(codeIn: string, codeDB: string): boolean {
    const currentTime = new Date();
    const uuidInfo = this.uuidExpire.get(codeIn);
    //입력한 uuid가 존재하지 않는다면
    if (uuidInfo === undefined) {
      return false;
    }
    //만료시간 지나면 해당 uuid 객체 삭제하고
    //DB에서의 비교 이전에 false를 반환.
    if (currentTime > uuidInfo.expiresAt) {
      this.uuidExpire.delete(codeIn);
      return false;
    }
    return codeIn == codeDB;
  }

  async updateVerification(user: Auth) {
    user.verified = true;
    //save는 새로 저장하거나, 기존 존재하는 레코드를 업데이트 하기 위한 다목적 툴.
    await this.authRepository.save(user);
  }

  async deleteUser(user: Partial<Auth>) {
    const userToDelete = await this.findUserByEmail(user.email);
    return await this.authRepository.remove(userToDelete);
  }

  getAccessToken(user: Partial<Auth>): string {
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        sub: user.nickname,
      },
      { secret: process.env.SECRET_KEY_ACCESS, expiresIn: '30m' },
    );
  }

  setRefreshToken(user: Auth, res: Response) {
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        sub: user.nickname,
      },
      { secret: process.env.SECRET_KEY_REFRESH, expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
    return;
  }
}
