import { And, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Like } from '../entity/like.entity';

@Injectable()
export class LikeRepository extends Repository<Like> {
  constructor(private dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }
  async userList(postId: number): Promise<string[]> {
    const likes = await this.createQueryBuilder('like')
      .leftJoinAndSelect('like.auth', 'auth')
      .leftJoin('like.post', 'post')
      .where('post.id = :postId', { postId })
      .getMany();

    return likes.map((like) => like.auth.nickname);
  }
}
