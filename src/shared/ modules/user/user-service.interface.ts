import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, UserEntity } from './index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findByEmailOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
