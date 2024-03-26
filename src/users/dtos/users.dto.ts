import { UserRoles } from '@models/user.model';
import { OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  readonly lastName?: string;

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
  readonly role?: UserRoles;

  @ValidateIf((user) => user.role === UserRoles.Administrator)
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  readonly masterPassword?: string;
}

export class FilterUserDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  readonly offset?: number;

  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email']),
) {}
