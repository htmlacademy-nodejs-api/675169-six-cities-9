import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto, CommentEntity } from './index.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findBy(keyWord: string): Promise<DocumentType<CommentEntity> | null>;
  findAllById(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteAllById(offerId: string): Promise<void>;
}
