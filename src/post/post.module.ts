import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repository/post-repository';
import { Like } from '../post/entity/like.entity';
import { Auth } from '../auth/entity/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Auth])],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
