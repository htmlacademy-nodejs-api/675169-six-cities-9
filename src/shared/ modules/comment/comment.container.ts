import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../enums/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentService, DefaultCommentService } from './index.js';

export function createCommentContainer() {
  const commentContainer = new Container();
  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
