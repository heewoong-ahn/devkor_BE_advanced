import { And, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Post } from '../post/entity/post.entity';
import { Auth } from '../auth/entity/auth.entity';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async createComment(
    postId: number,
    content: string,
    userId: number,
    commentId?: number,
  ): Promise<Comment> {
    //entity에서 선언한 것과 변수명 맞춰야 작동함.
    const auth = new Auth();
    auth.id = userId;

    const post = new Post();
    post.id = postId;

    const parentComment = new Comment();
    parentComment.id = commentId;

    const postToUpate = await Post.findOne({ where: { id: postId } });
    //대댓글이 아니면
    if (!commentId) {
      const comment = this.create({ content, auth, post });
      await this.save(comment);
    }
    //대댓글이면
    else {
      //대댓글에는 대댓글을 못단다
      const hasParent = await this.findOne({
        where: { id: commentId },
        relations: ['parentComment'],
      });
      //부모 댓글이 없다면
      if (!hasParent.parentComment) {
        const comment = this.create({ content, auth, post, parentComment });
        await this.save(comment);
        return comment;
      } else {
        throw new Error('대댓글에는 댓글을 달 수 없습니다.');
      }
    }
  }

  async deleteComment(commentId: number): Promise<boolean> {
    //transaction 시작
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const commentToDelete = await queryRunner.manager.findOne(Comment, {
        where: { id: commentId },
      });
      if (!commentToDelete) {
        // 해당 commentId에 해당하는 댓글이 없는 경우 롤백
        throw new Error(`${commentId}번 댓글이 존재하지 않습니다.`);
      }
      commentToDelete.auth = null;
      commentToDelete.content = '삭제된 댓글입니다.';
      commentToDelete.createdAt = null;
      await queryRunner.manager.save(commentToDelete);
      //내용 수정과 softDelete을 동시에 수행하면 deletedAt이 null이 되는 문제 발생.
      //softdelete을 한(상태의) record는 보통 내용 수정을 안하는듯?
      await queryRunner.manager.softDelete(Comment, commentToDelete);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async commentList(postId: number): Promise<Object> {
    //삭제된 댓글에서 유저정보를 지웠기 때문에 auth가 null인 값들이 있음.
    const comments = await this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.auth', 'auth')
      .leftJoin('comment.post', 'post')
      .where('post.id = :postId', { postId })
      .withDeleted()
      .orderBy('comment.createdAt', 'DESC')
      .getMany();

    return comments.map((comment) => ({
      writer: comment.auth?.nickname,
      content: comment.content,
    }));
  }
}
