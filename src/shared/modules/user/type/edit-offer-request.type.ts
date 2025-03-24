import { Request } from 'express';
import { RequestBody } from '../../../types/index.js';
import { EditOfferDto, ParamOfferId } from '../../offer/index.js';

export type EditOfferRequest = Request<ParamOfferId, RequestBody, EditOfferDto>;
