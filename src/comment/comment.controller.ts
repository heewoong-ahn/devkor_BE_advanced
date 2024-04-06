import {
  Body,
  Controller,
  UseGuards,
  Post,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from 'src/auth/entity/auth.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('access'))
  @Post('/:postId/:commentId')
  async createComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @Body() body: { content: string },
    @Req() req,
  ) {
    //try, catch는 컨트롤러에서 해서 internal server error 500이 뜨든
    //error가 뜨면 다른 메세지를 보내주자.
    try {
      const newComment = await this.commentService.createComment(
        postId,
        body.content,
        req.user.id,
        commentId,
      );
      return {
        success: true,
        msg: '댓글이 성공적으로 달렸습니다.',
        comment: newComment,
      };
    } catch (error) {
      if (error.message == '대댓글에는 댓글을 달 수 없습니다.') {
        return { success: false, msg: '대댓글에는 댓글을 달 수 없습니다.' };
      }
      console.log(error);
      return { success: false, msg: '댓글을 다는데 실패했습니다.' };
    }
  }

  @UseGuards(AuthGuard('access'))
  @Delete('/delete/:commentId')
  async deleteComment(@Param('commentId') commentId: number) {
    //repository에서 transaction사용하면서 try catch로 잡아줘서
    //controller에서 안잡아줘도 될듯?
    try {
      const isDeleted = await this.commentService.deleteComment(commentId);
      if (isDeleted) {
        return { success: 'true', msg: '댓글이 성공적으로 삭제되었습니다.' };
      } else {
        return { succees: 'false', msg: '댓글이 삭제되지 않았습니다.' };
      }
    } catch (error) {
      return {
        success: 'false',
        msg: error.message,
      };
    }
  }
}
