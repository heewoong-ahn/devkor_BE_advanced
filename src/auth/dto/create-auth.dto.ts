//클라이언트에서 서버로 보내지는 데이터에 대한 유효성 검사
//컨트롤러에서 처리함.
//데이터 형식을 지정함으로서 컨트롤러에서 사용할 때 데이터 유효성을 검증함.
//예를 들어, createUser 컨트롤러에서 클라이언트로부터 받을 이메일은 꼭
//이메일 형식이어야 함을 보장해야할 때 등.

import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { IntegerType } from 'typeorm';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  nickname: string;

  // @IsNotEmpty()
  // code: string;

  // @IsNotEmpty()
  // verified: boolean;
}
