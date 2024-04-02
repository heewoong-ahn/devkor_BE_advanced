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
}
