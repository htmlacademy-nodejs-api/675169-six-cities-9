import { Request } from 'express';
import { RequestBody } from '../../../types/index.js';
import { ChangeFavoriteDto, ParamUserIdOfferId } from '../index.js';

export type ChangeFavoriteRequest = Request<ParamUserIdOfferId, RequestBody, ChangeFavoriteDto>;
