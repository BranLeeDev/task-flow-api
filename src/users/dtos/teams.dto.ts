import { PartialType } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly name: string;

  @IsOptional()
  @IsString()
  @MinLength(15)
  readonly description?: string;
}

export class InvitationDto {
  @IsNotEmpty()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  @IsArray()
  @ArrayUnique()
  usersIds: number[];
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
