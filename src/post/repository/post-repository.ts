import { And, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Post } from '../entity/post.entity';
import { Auth } from '../../auth/entity/auth.entity';
import { CreatePostDto } from '../dto/create-entity.dto';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async listPosts(
    page: number,
    filter: string,
    search: string,
  ): Promise<Post[]> {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    let query = this.createQueryBuilder('post')
      .leftJoin('post.auth', 'auth')
      .select(['post', 'auth.nickname'])
      .orderBy(`post.${filter}`, 'DESC')
      .skip(skip)
      .take(perPage);

    // 검색어가 주어진 경우, title 또는 닉네임으로 검색
    if (search) {
      query = query.where(
        'post.title LIKE :search OR auth.nickname LIKE :search OR post.content LIKE :search',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    //hw을 id로 가진 유저 생성
    const auth = new Auth();
    auth.id = createPostDto.authId;
    //hw을 id로 가진 auth로 auth 필드 값을 채움으로서 id가 hw인 auth entity
    //객체와 연결됨
    const post = this.create({ ...createPostDto, auth });

    return this.save(post);
  }

  async deletePost(postId: number) {
    const isDeleted = await this.delete({ id: postId });
  }

  async emailOfPost(postId: number): Promise<string> {
    //auth랑 연결되지 않은 이상한 post값이 들어왔을 때: 존재하지 않는 postID값을 받을 때
    let userEmail = '';
    try {
      const post = await this.findOne({
        where: { id: postId },
        relations: ['auth'],
      });
      userEmail = post.auth.email;
    } catch (error) {
    } finally {
      return userEmail;
    }
  }

  //되나 확인.. relations 통해서 객체 부여하면 join해서 가져온 것과 같은 효과? 연결된 auth레코드를 load하는 효과인듯?
}
