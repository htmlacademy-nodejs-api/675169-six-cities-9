import { ParamOfferId } from './param-offerid.type.js';
import { Request } from 'express';
import { RequestBody} from '../../../types/index.js';
import { CreateOfferDto } from '../dto/create-offer.dto.js';

export type CreateOfferRequestParamOfferId = Request<ParamOfferId, RequestBody, CreateOfferDto>;
