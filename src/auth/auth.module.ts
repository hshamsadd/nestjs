import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategies';
import { RolesGuard } from './guards/roles-guard';

@Module({
  // This will make the post repository available for injection
  // Available in the current scope
  imports: [
    TypeOrmModule.forFeature([User]),
    // import passport module
    PassportModule,
    // configure jwt
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard], // jwt strategy, roles guard (done)
  exports: [AuthService, RolesGuard], // export roles guard (done)
})
export class AuthModule {}
