import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../enums/index.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { OfferService, DefaultOfferService, OfferController } from './index.js';
import { Controller } from '../../libs/rest/index.js';

export function createOfferContainer() {
  const offerContainer = new Container();
  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  return offerContainer;
}
