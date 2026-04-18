import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(30, { message: 'Password cannot be longer than 30 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;
}

// import {
//   IsEmail,
//   IsNotEmpty,
//   IsString,
//   MaxLength,
//   MinLength,
// } from 'class-validator';

// export class RegisterDto {
//   @IsEmail({}, { message: 'Please provide a valid email' })
//   email: string;

//   @IsNotEmpty({ message: 'Name is required! Please provide a name' })
//   @IsString({ message: 'Name must be a string' })
//   @MinLength(3, { message: 'Name must be at least 3 characters long' })
//   @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
//   name: string;

//   @IsNotEmpty({ message: 'Password is required! Please provide a Password' })
//   @IsString({ message: 'Password must be a string' })
//   @MinLength(8, { message: 'Password must be at least 6 characters long' })
//   @MaxLength(30, { message: 'Password cannot be longer than 30 characters' })
//   password: string;
// }
