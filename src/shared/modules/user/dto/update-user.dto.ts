import { IsOptional, IsString, Length } from 'class-validator';
import { CreateUserMessages } from './create-user.messages.js';
import { USER_NAME_MAX, USER_NAME_MIN } from '../../../constants/index.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(USER_NAME_MIN, USER_NAME_MAX, { message: CreateUserMessages.name.lengthField })
  public name?: string;

  @IsOptional()
  @IsString()
  public image?: string;
}
