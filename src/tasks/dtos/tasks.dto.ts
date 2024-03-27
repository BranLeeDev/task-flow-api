import { PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@models/task.model';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly name: string;

  @IsOptional()
  @IsString()
  @MinLength(15)
  readonly description?: string;

  @IsNotEmpty()
  @IsDate()
  @MinDate(new Date())
  readonly dueDate: Date;

  @IsOptional()
  @IsEnum(TaskStatus)
  readonly status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  readonly priority?: TaskPriority;
}

export class FilterTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  readonly status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  readonly priority?: TaskPriority;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
