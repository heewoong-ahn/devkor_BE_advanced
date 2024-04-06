import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Auth } from '../../auth/entity/auth.entity';
import { Post } from '../../post/entity/post.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date; //soft delete하기 위함.

  @ManyToOne((type) => Auth, (auth) => auth.comments)
  auth: Auth;

  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;

  //자기참조 : 대댓글
  @ManyToOne(() => Comment, { nullable: true })
  parentComment: Comment;
}
