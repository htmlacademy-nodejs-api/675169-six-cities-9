import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../types/index.js';
import { CreateOfferDto } from '../dto/create-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;


