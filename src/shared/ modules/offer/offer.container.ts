import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { OfferService, DefaultOfferService } from './index.js';


export function createOfferContainer() {
  const userContainer = new Container();
  userContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  userContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return userContainer;
}
