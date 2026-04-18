import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  // imports: [], // import other modules if needed.
  // exports: [], // export services if needed in other modules.
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
