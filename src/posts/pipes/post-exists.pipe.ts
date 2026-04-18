import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PostsService } from '../posts.service';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postService: PostsService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const post = await this.postService.findOne(value);
    if (!post) {
      throw new NotFoundException(`Post with ID ${value} is not found`);
    }

    return value;
  }
}

/*
@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postService: PostsService) {}

  async transform(value: number) {
    await this.postService.findOne(value);
    return value;
  }
}
*/
