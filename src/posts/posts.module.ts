import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  // This will make the post repository available for injection
  // Available in the current scope
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
