import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    bcrypt.hash('123456', 10).then(console.log);
  }

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    // normalize email
    const normalizedEmail = email.toLowerCase();

    // check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new ConflictException(
        'Email already exists! Please use a different email',
      );
    }

    // hash password
    const hashedPassword = await this.hashPassword(password);

    // create user entity
    const newUser = this.userRepository.create({
      email: normalizedEmail,
      name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    try {
      // save user inside a transaction for future expansion
      const savedUser = await this.userRepository.manager.transaction(
        async (manager) => manager.save(newUser),
      );

      // return user without password
      return {
        user: classToPlain(savedUser),
        message: 'Registration successful! Please login to continue.',
      };
    } catch (err) {
      throw new InternalServerErrorException(
        'Unable to register user, please try again later',
      );
    }
  }

  async createAdmin(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    // normalize email
    const normalizedEmail = email.toLowerCase();

    // check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new ConflictException(
        'Email already exists! Please use a different email',
      );
    }

    // hash password
    const hashedPassword = await this.hashPassword(password);

    // create user entity
    const newUser = this.userRepository.create({
      email: normalizedEmail,
      name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    try {
      // save user inside a transaction for future expansion
      const savedUser = await this.userRepository.manager.transaction(
        async (manager) => manager.save(newUser),
      );

      // return user without password
      return {
        user: classToPlain(savedUser),
        message: 'Admin user created successfully! Please login to continue.',
      };
    } catch (err) {
      throw new InternalServerErrorException(
        'Unable to register user, please try again later',
      );
    }
  }

  async login(loginDto: LoginDto) {
    // normalize email
    const normalizedEmail = loginDto.email.toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Invalid Credentials or account does not exist',
      );
    }
    // Generate the tokens
    const tokens = await this.generateTokens(user);
    const { password, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'JWT_REFRESH_TOKEN',
      });
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Find the current user by ID (later)
  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
  // Find the current user by ID (later)

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '12', 10);
    return bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateAccessToken(user: User): string {
    // -> email, sub(id), role -> to implement RBAC -> user ? Admin ?
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: 'JWT_SECRET',
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: 'JWT_REFRESH_TOKEN',
      expiresIn: '7d',
    });
  }

  private async generateTokens(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }
}

// import { ConflictException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User, UserRole } from './entities/user.entity';
// import { Repository } from 'typeorm';
// import { RegisterDto } from './dto/register.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async register(registerdto: RegisterDto) {
//     const existingUser = await this.userRepository.findOne({
//       where: { email: registerdto.email },
//     });
//     if (existingUser) {
//       throw new ConflictException(
//         'Email already exists! Please use a diffirent email',
//       );
//     }
//     const hashedPassword = await this.hashPassword(registerdto.password);
//     const newUser = this.userRepository.create({
//       email: registerdto.email.toLowerCase(),
//       name: registerdto.name,
//       password: hashedPassword,
//       role: UserRole.User,
//     });
//     try {
//       const saveUser = await this.userRepository.save(newUser);
//       const { password, ...result } = saveUser;
//       return {
//         user: result,
//         message: 'Registration successful! Please login to continue.',
//       };
//     } catch (err) {
//       throw new ConflictException('Unable to register user, please try again.');
//     }
//   }
//   private async hashPassword(password: string): Promise<string> {
//     const saltRounds = parseInt(process.env.BCRYPT_SALT || '12', 10);
//     return bcrypt.hash(password, saltRounds);
//   }
// }
