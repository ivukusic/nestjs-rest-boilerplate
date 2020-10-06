import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Task title', type: () => String })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Task description', type: () => String })
  description: string;
}
