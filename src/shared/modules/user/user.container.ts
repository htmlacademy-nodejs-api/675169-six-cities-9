import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../enums/index.js';
import { DefaultUserService, UserController, UserEntity, UserModel, UserService } from './index.js';
import { Controller } from '../../libs/rest/index.js';

export function createUserContainer() {
  const container = new Container();
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return container;
}
