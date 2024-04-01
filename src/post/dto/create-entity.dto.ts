import { IsNotEmpty, Length } from 'class-validator';
import { IntegerType } from 'typeorm';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  authId: number;
}
