import { Request } from 'express';
import { RequestBody } from '../../libs/rest/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { ParamOfferId } from '../user/index.js';

export type CreateCommentRequest = Request<ParamOfferId, RequestBody, CreateCommentDto>;
