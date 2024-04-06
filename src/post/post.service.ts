import { Injectable } from '@nestjs/common';
import { PostRepository } from './repository/post-repository';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-entity.dto';
import { Like } from '../post/entity/like.entity';
import { Repository } from 'typeorm';
import { Auth } from '../auth/entity/auth.entity';
import { LikeRepository } from './repository/like-repository';
import { CommentRepository } from 'src/comment/comment-repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    @InjectRepository(LikeRepository)
    private readonly likeRepository: LikeRepository,
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
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

  async deletePost(postId: number, email: string): Promise<boolean> {
    const postEmail = await this.postRepository.emailOfPost(postId);
    if (email == postEmail) {
      await this.postRepository.deletePost(postId);
      return true;
    } else return false;
  }

  async pressLike(postId: number, email: string): Promise<boolean> {
    let like = null;

    const user = await Auth.findOne({ where: { email } });
    const authId = user.id;

    try {
      like = await this.likeRepository.findOne({
        where: { post: { id: postId }, auth: { id: authId } },
      });
      await this.likeRepository.delete(like);
      await this.postRepository.adjustLike(postId, -1);
    } catch (error) {
      //sql문에 null값 등이 들어가 error가 났을 때
    }

    //좋아요하지 않았다면
    if (!like) {
      const post = new Post();
      post.id = postId;
      const auth = new Auth();
      auth.id = authId;

      const newLike = await this.likeRepository.create({ post, auth });
      await this.likeRepository.save(newLike);
      await this.postRepository.adjustLike(postId, 1);

      return false;
    }
    return true;
  }
  async test(id: number): Promise<string> {
    return await this.postRepository.test(id);
  }

  async getPostInfo(postId: number): Promise<Object> {
    const postInfo = await this.postRepository.postInfo(postId);
    postInfo['likeList'] = await this.likeRepository.userList(postId);
    postInfo['commentList'] = await this.commentRepository.commentList(postId);

    return postInfo;
  }
}
