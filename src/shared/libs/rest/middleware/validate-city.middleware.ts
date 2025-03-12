import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { CityEnum } from '../../../enums/index.js';

export class ValidateCityMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const city = params[this.param];

    if (Object.values(CityEnum).includes(city as CityEnum)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${city} is not included to valid сities`,
      'ValidateCityMiddleware'
    );
  }
}
