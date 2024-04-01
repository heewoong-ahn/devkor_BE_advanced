import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repository/post-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
