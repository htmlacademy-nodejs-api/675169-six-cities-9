import { Image } from '../../../types/index.js';

export class CreateUserDto {
  public name: string;
  public password: string;
  public email: string;
  public pro: boolean;
  public image: Image;
}
