import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../enums/index.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { OfferService, DefaultOfferService, OfferController } from './index.js';
import { Controller } from '../../libs/rest/index.js';

export function createOfferContainer() {
  const container = new Container();
  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  return container;
}
