import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Get, Post, Delete } from '@nestjs/common';
import { CreatePostDto } from 'src/post/dto/create-entity.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/tt')
  async test(@Body() body: { id: number }) {
    return this.postService.test(body.id);
  }

  @Get('/:page')
  async listPosts(
    @Param('page') page: number,
    @Query('filter') filter: string,
    @Query('search') search: string,
  ) {
    const pageList = await this.postService.listPosts(page, filter, search);

    if (Object.keys(pageList).length === 0) {
      return { success: 'false', msg: '표시할 게시글이 없습니다.' };
    }

    return {
      success: 'true',
      msg: '게시글을 성공적으로 표시했습니다.',
      pageList: pageList,
    };
  }

  //req.user~정보 써서 해도 됐을듯.
  @UseGuards(AuthGuard('access'))
  @Post('/')
  async createPost(@Body() body: CreatePostDto) {
    const post = await this.postService.createPost(body);
    return { success: 'true', msg: '게시글을 성공적으로 게시했습니다.' };
  }

  @UseGuards(AuthGuard('access'))
  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number, @Req() req) {
    const isDeleted = await this.postService.deletePost(postId, req.user.email);

    if (!isDeleted) {
      return { success: 'false', msg: '게시글을 삭제하는데 실패했습니다.' };
    }

    return { success: 'true', msg: '게시글을 성공적으로 삭제했습니다.' };
  }

  @UseGuards(AuthGuard('access'))
  @Post('/:postId/like')
  async pressLike(@Param('postId') postId: number, @Req() req) {
    const isLiked = await this.postService.pressLike(postId, req.user.email);

    if (!isLiked) {
      return {
        success: 'true',
        msg: '게시글을 좋아요 했습니다.',
        info: 'liked',
      };
    }
    return {
      success: 'true',
      msg: '게시글 좋아요를 취소했습니다.',
      info: 'notLiked',
    };
  }
}
