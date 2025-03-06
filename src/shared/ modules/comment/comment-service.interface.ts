import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto, CommentEntity } from './index.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findAllByAuthorId(authorId: string): Promise<DocumentType<CommentEntity>[]>;
  findAllByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteAllByOfferId(offerId: string): Promise<void>;
}
