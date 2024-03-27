import { ProjectPriority, ProjectStatus } from '@models/project.model';
import { PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinDate,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  readonly description: string;

  @IsNotEmpty()
  @IsDate()
  @MinDate(new Date())
  readonly dueDate: Date;

  @IsOptional()
  @IsEnum(ProjectStatus)
  readonly status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority)
  readonly priority?: ProjectPriority;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999.99)
  readonly budget: number;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
