import { Request } from 'express';
import { RequestBody } from '../../../types/index.js';
import { ParamUserIdOfferId } from '../index.js';
import { EditOfferDto } from '../../offer/index.js';

export type EditOfferRequest = Request<ParamUserIdOfferId, RequestBody, EditOfferDto>;
