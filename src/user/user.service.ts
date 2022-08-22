import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { User, type UserDocument } from './user.schema';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async save(dto: CreateUserDto): Promise<User> {
    return await this.userModel.create(dto);
  }

  async getByQuery(query: GetUserDto): Promise<User> {
    return await this.userModel.findOne(query);
  }
}
