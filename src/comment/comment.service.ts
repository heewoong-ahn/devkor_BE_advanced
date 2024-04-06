import { Inject, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Post } from '../post/entity/post.entity';
import { PostRepository } from 'src/post/repository/post-repository';

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
    //repository 통해 접근하는 것 권장하나
    //처음부터 잘못짜서 comment와 post가 서로에게 의존성을 가져 서로 import하지 못해
    //이미 post에서 comment를 import해서 쓰고 있음.
    const post = await Post.findOne({ where: { id: postId } });
    post.commentsCnt += 1;
    Post.save(post);
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
