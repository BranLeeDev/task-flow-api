import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(11)
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  readonly password: string;
}
