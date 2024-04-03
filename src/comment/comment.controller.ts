import { Body, Controller, UseGuards, Post, Req, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';

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
      return { success: false, msg: '댓글을 다는데 실패했습니다.' };
    }
  }
}
