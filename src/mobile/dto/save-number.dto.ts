import { IsNotEmpty } from 'class-validator';

export class SaveNumberDto {
  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  changed: string;
}
