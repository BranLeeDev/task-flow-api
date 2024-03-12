import { UserRoles } from '@models/user.model';
import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  readonly firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  readonly lastName: string;

  @IsString()
  @IsEmail()
  @MinLength(10)
  @MaxLength(100)
  readonly email: string;

  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  @MaxLength(50)
  readonly password: string;

  @IsOptional()
  @IsEnum(UserRoles)
  readonly role: UserRoles;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
