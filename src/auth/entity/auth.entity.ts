import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthStatus } from '../auth-status-enum';
import { Post } from 'src/post/entity/post.entity';

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
}
