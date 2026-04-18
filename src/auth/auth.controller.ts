import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { currentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorators';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './guards/roles-guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerdto: RegisterDto) {
    return this.authService.register(registerdto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // Protected routes

  // Current user route
  // Current user route
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@currentUser() user: any) {
    return user;
  }

  // Create admin route
  // Chceck if user is authentcated and user role is an admin user
  // Create admin route
  @Post('create-admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createAdmin(@Body() registerdto: RegisterDto) {
    return this.authService.createAdmin(registerdto);
  }

  // Protected routes
}
