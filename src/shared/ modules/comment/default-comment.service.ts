import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentEntity, CommentService, CreateCommentDto } from './index.js';
import { MAX_COMMENTS_NUMBER } from '../../constants/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const newComment = new CommentEntity(dto);

    const result = await this.commentModel.create(newComment);

    this.logger.info(`New comment created at: ${result.createdAt}`);

    return result;
  }

  public async findBy(keyWord: string): Promise<DocumentType<CommentEntity> | null> {
    return await this.commentModel.findOne({ keyWord });
  }

  public async findAllById(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel.find({ offerId }).sort({ createdAt: SortType.Down}).limit(MAX_COMMENTS_NUMBER).exec();
  }

  public async deleteAllById(offerId: string): Promise<void> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    this.logger.info(`${result.deletedCount} were deleted`);
  }
}
