import { PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsNotEmpty,
  IsOptional,
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
  readonly description: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  readonly members: number[];
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
