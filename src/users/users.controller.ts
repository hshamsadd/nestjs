import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';

@Controller('users') // /users
export class UsersController {
  // ROUTES

  @Get() // GET /users or /users?role=value
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return [];
  }

  // Order is important so that you don't run with id route issues
  @Get('interns') // GET /users/inters
  findAllInterns() {
    return [];
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id') id: string) {
    return { id };
  }

  @Post() // POST /users/
  create(@Body() user: {}) {
    return user;
  }

  @Patch(':id') // PATCH /users/:id
  update(@Param('id') id: string, @Body() userUpdate: {}) {
    return { id, ...userUpdate };
  }

  @Delete(':id') // DELETE /users/:id
  delete(@Param('id') id: string) {
    return { id };
  }
}
