import { Length, IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 50)
  name: string;

  @Length(10, 128)
  description: string;

  @IsDateString()
  when: string;

  @IsString()
  address: string;
}
