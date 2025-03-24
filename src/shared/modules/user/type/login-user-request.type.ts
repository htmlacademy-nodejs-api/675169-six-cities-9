import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { LoginUserDto } from '../index.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
