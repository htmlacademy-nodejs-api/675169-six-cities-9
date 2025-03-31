import { IsBoolean, IsEmail, IsString, Length} from 'class-validator';
import { CreateUserMessages } from './create-user.messages.js';
import { PASSWORD_MAX_NUMBER, PASSWORD_MIN_NUMBER, USER_NAME_MAX, USER_NAME_MIN } from '../../../constants/index.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(USER_NAME_MIN, USER_NAME_MAX, { message: CreateUserMessages.name.lengthField })
  public name: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(PASSWORD_MIN_NUMBER, PASSWORD_MAX_NUMBER, { message: CreateUserMessages.password.lengthField })
  public password: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsBoolean({ message: CreateUserMessages.isPro.invalid })
  public isPro: boolean;
}
