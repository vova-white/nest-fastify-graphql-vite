import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { Technologies, type Technology } from './technologies.type';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop([{ type: String, enum: Technologies }])
  technologies: Technology[];
}

export const UserSchema = SchemaFactory.createForClass(User);
