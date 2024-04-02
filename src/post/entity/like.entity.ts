//어떤 사용자가 어떤 게시글을 좋아했는지 추척하고
//게시글에 달린 좋아요 수 추적 목적 테이블

import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Auth } from '../../auth/entity/auth.entity';
import { Post } from './post.entity';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Auth, (auth) => auth.likes)
  auth: Auth;

  @ManyToOne((type) => Post, (post) => post.likes)
  post: Post;
}

//좋아요 버튼 누르고 안누르고에 따라서 record 생성 및 지우기
//post보여줄 때 user가 좋아요 누른건지 시각적으로 보여주는 것은
//like table에서 로그인한 유저와 연결된 모든 테이블을 체크하면 됨.

//게시글을 들어갔을 때 사용자가 좋아요한 게시글인지 확인하려면
//게시글을 여는 사용자 id와 게시글 id로 like 테이블에서 record 빼옴.

//! 유저마다 좋아요한 post를 목록으로 관린해서 front로 보내주면
//프론트에서 post들을 띄울 때 post가 목록에 있으면 좋아요을 한걸로 간주해서
//화면에 띄워주는 등의 구현?
