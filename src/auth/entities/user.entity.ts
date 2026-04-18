import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string; // hashed

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.authorName)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// import { Post } from 'src/posts/entities/post.entity';
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Exclude } from 'class-transformer';

// export enum UserRole {
//   User = 'user',
//   Admin = 'admin',
// }

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   name: string;

//   @Column()
//   @Exclude()
//   password: string; // hash the password (to do)

//   @Column({
//     type: 'enum',
//     enum: UserRole,
//     default: UserRole.User,
//   })
//   role: UserRole;

//   @OneToMany(() => Post, (post) => post.authorName)
//   posts: Post[];

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
