import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { CommentEntity, CommentService, CreateCommentDto } from './index.js';
import { MAX_COMMENTS_NUMBER } from '../../constants/index.js';
import { Component, SortType } from '../../enums/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const newComment = await this.commentModel.create(dto);
    this.logger.info(`New comment created at: ${newComment.createdAt}`);

    return newComment;
  }

  public async findAllByAuthorId(authorId: string): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel.find({ author: authorId }).exec();
  }

  public async findAllByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel.find({ offerId }).sort({ createdAt: SortType.Down}).limit(MAX_COMMENTS_NUMBER).exec();
  }

  public async deleteAllByOfferId(offerId: string): Promise<void> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    this.logger.info(`${result.deletedCount} comments for offer with id ${offerId} were deleted`);
  }
}
