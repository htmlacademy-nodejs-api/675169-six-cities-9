import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../enums/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentController, CommentService, DefaultCommentService } from './index.js';
import { Controller } from '../../libs/rest/index.js';

export function createCommentContainer() {
  const container = new Container();
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();
  return container;
}
