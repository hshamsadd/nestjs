import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

// root module --> uses all the sub modules
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'hyfuser',
      password: 'hyfpassword',
      database: 'youtube-nestjs-project',
      entities: [Post, User], // array of entities that you want to register
      synchronize: true, // only for dev mode and must be false for prod
    }),

    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available in the project
    }),
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
