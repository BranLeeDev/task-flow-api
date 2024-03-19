import { ProjectPriority, ProjectStatus } from '@models/project.model';
import { OmitType, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinDate,
  MinLength,
  ValidateIf,
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

  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  readonly status?: ProjectStatus;

  @IsNotEmpty()
  @IsEnum(ProjectPriority)
  readonly priority?: ProjectPriority;

  @IsNotEmpty()
  @IsNumber()
  @IsDecimal()
  @Min(0.01)
  @Max(999999.99)
  readonly budget: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @IsNumber()
  readonly managerId?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @ValidateIf((project) => !project.userId)
  readonly teamId?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @ValidateIf((project) => !project.teamId)
  readonly userId?: number;
}

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['userId', 'teamId', 'managerId']),
) {}
