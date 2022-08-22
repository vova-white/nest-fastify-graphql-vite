import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
