import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Param,
  Query,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
// import type { PostInterface } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
// import { PostExistsPipe } from './pipes/post-exists.pipe';
import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { currentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles-guard';

// CRUD Controllers
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('search') search?: string): Promise<PostEntity[]> {
    return this.postsService.findAll(search);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe /*PostExistsPipe*/) id: number,
  ): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Validate incoming requests body scoped locally to this method
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Body() createPost: CreatePostDto,
    @currentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.create(createPost, user);
  }

  // Partially update
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    // Validate updating requests Param scoped locally to this method using a custome PostExistsPipe
    @Param('id', ParseIntPipe /*PostExistsPipe*/) id: number,
    @Body() updatePost: UpdatePostDto,
    @currentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePost, user);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe /*PostExistsPipe*/) id: number,
  ): Promise<void> {
    await this.postsService.remove(id);
  }
}

// create(
//   @Body() createPost: Omit<PostInterface, 'id' | 'createdAt'>,
// ): PostInterface {
//   return this.postsService.create(createPost);
// }
