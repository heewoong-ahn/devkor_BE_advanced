import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
  ) {}

  async createComment(
    postId: number,
    content: string,
    userId: number,
    commentId?: number,
  ): Promise<Comment> {
    return await this.commentRepository.createComment(
      postId,
      content,
      userId,
      commentId,
    );
  }

  async deleteComment(commentId: number): Promise<boolean> {
    return await this.commentRepository.deleteComment(commentId);
  }
}
