import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, Length } from 'class-validator';
import { Technologies, type Technology } from '../technologies.type';

export class CreateUserDto {
  @ApiProperty({ example: 'email@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6, 30)
  password: string;

  @ApiProperty({ type: [String], enum: Technologies })
  @IsArray()
  @IsEnum(Technologies, { each: true })
  technologies: Technology[];
}
