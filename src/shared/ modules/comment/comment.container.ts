import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentService, DefaultCommentService } from './index.js';

export function createCommentContainer() {
  const userContainer = new Container();
  userContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  userContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return userContainer;
}
