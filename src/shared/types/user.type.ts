import { Image } from './image.type.js';

export type User = {
  name: string;
  email: string;
  image: Image;
  password: string;
  pro: boolean
}
