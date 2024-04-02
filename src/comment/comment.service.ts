import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment-repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
  ) {}
}
