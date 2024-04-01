import { Injectable } from '@nestjs/common';
import { PostRepository } from './repository/post-repository';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-entity.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}

  async listPosts(
    page: number,
    filter: string,
    search: string,
  ): Promise<Post[]> {
    return this.postRepository.listPosts(page, filter, search);
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    return this.postRepository.createPost(createPostDto);
  }

  //repository 기능 활용해서 post의 작성자와 지우려는자가 같은지 검토.
}
