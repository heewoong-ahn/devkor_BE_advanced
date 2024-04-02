import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthStatus } from '../auth-status-enum';
import { Post } from 'src/post/entity/post.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { Like } from '../../post/entity/like.entity';

@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  email: string;

  @Column('varchar')
  password: string;

  @Column('varchar')
  nickname: string;

  @Column('varchar')
  code: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => Post, (post) => post.auth)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.auth)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.auth)
  likes: Like[];
}
