import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type LanguageDocument = Language & Document;

@Schema()
export class Language {
  @ApiProperty()
  @Prop({ required: true })
  languageCode: string;

  @ApiProperty()
  @Prop({ required: true })
  languageName: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
