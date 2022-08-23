import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Types, Document } from 'mongoose';
import { Technologies, type Technology } from './technologies.type';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop([{ type: String, enum: Technologies }])
  technologies: Technology[];
}

export const UserSchema = SchemaFactory.createForClass(User);
