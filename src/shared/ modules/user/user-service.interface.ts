import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, UserEntity } from './index.js';
import { FullOffer } from '../../types/index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findByEmailOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  getAllFavorites(userId: string): Promise<DocumentType<FullOffer>[]>
  addToOrRemoveFromFavoritesById(userId: string, offerId: string, isAdding?: boolean): Promise<DocumentType<UserEntity> | null>;
}
