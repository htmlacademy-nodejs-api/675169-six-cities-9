import { Request } from 'express';
import { RequestBody, RequestParams } from '../../types/index.js';
import { ChangeFavoriteDto } from './index.js';

export type ChangeFavoriteRequest = Request<RequestParams, RequestBody, ChangeFavoriteDto>;
