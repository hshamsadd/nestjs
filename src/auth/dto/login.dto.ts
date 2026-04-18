import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required! Please provide a Password' })
  @IsString({ message: 'Invalid password' })
  @MinLength(6, { message: 'Invalid password' })
  @MaxLength(30, { message: 'Invalid password' })
  password: string;
}
