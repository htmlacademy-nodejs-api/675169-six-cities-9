import { Request } from 'express';
import { RequestBody } from '../../../types/index.js';
import { ParamOfferId } from '../index.js';

export type ChangeFavoriteRequest = Request<ParamOfferId, RequestBody, RequestBody>;
