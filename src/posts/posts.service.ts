import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import type { PostInterface } from './interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';

// CRUD Services Logic using typeorm with Postgresql
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(search?: string): Promise<Post[]> {
    if (!search) {
      return this.postsRepository.find({
        relations: ['authorName'],
      });
    }
    // Database handles filtering Instead of Memory Filtering to avoid loading thousands of rows into Node. scalable for large tables
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorName', 'author')
      .where('LOWER(post.title) LIKE LOWER(:search)', {
        search: `%${search}%`,
      })
      .getMany();
  }

  async findOne(id: number): Promise<Post> {
    const singlePost = await this.postsRepository.findOne({
      where: { id },
      relations: ['authorName'],
    });
    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }
    return singlePost;
  }

  async create(createPost: CreatePostDto, authorName: User): Promise<Post> {
    const newPost = this.postsRepository.create({
      ...createPost,
      authorName: authorName,
    });
    return this.postsRepository.save(newPost);
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own posts');
    }
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const postToDelete = await this.findOne(id);
    await this.postsRepository.remove(postToDelete);
  }
}

/*

  // async patch(id: number, updatedPost: UpdatePostDto): Promise<Post> {
  //   const postToEdit = await this.findOne(id);
  //   if (updatedPost.title) {
  //     postToEdit.title = updatedPost.title;
  //   }
  //   if (updatedPost.content) {
  //     postToEdit.content = updatedPost.content;
  //   }
  //   if (updatedPost.authorName) {
  //     postToEdit.authorName = updatedPost.authorName;
  //   }
  //   return this.postsRepository.save(postToEdit);
  // }
  
  private getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }


    remove(id: number): void {
    const post = this.findOne(id); // will throw if not found
    this.posts = this.posts.filter((p) => p.id !== post.id);
  }
    
    remove(id: number): void {
    const currentPostIndex = this.posts.findIndex((post) => post.id === id);

    if (currentPostIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }
    this.posts.splice(currentPostIndex, 1);
  }
*/
