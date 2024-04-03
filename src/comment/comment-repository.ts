import { And, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Post } from '../post/entity/post.entity';
import { Auth } from '../auth/entity/auth.entity';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async createComment(
    postId: number,
    content: string,
    userId: number,
    commentId?: number,
  ): Promise<Comment> {
    //entity에서 선언한 것과 변수명 맞춰야 작동함.
    const auth = new Auth();
    auth.id = userId;

    const post = new Post();
    post.id = postId;

    const parentComment = new Comment();
    parentComment.id = commentId;
    //대댓글이 아니면
    if (!commentId) {
      const comment = this.create({ content, auth, post });
      await this.save(comment);
    }
    //대댓글이면
    else {
      const comment = this.create({ content, auth, post, parentComment });
      await this.save(comment);
      return comment;
    }
  }
}
