import { ParamsDictionary } from 'express-serve-static-core';

export type ParamUserIdOfferId = {
  userId: string;
  offerId: string;
} | ParamsDictionary;
