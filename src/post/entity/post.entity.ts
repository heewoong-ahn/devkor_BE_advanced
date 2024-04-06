import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../../auth/entity/auth.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { Like } from './like.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'integer', default: 0 })
  viewsCnt: number;

  @Column({ type: 'integer', default: 0 })
  likesCnt: number;

  @Column({ type: 'integer', default: 0 })
  commentsCnt: number;

  @ManyToOne((type) => Auth, (auth) => auth.posts)
  auth: Auth;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
