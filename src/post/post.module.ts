import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repository/post-repository';
import { Like } from '../post/entity/like.entity';
import { Auth } from '../auth/entity/auth.entity';
import { LikeRepository } from './repository/like-repository';
import { CommentModule } from 'src/comment/comment.module';
import { CommentRepository } from 'src/comment/comment-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Auth]), CommentModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, LikeRepository, CommentRepository],
})
export class PostModule {}
