
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DocumentExists } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { Middleware } from '../index.js';
import { Types } from 'mongoose';

export class AuthorisationMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
  ) {}

  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    // if (! tokenPayload) {
    //   throw new HttpError(
    //     StatusCodes.UNAUTHORIZED,
    //     'Unauthorized',
    //     'PrivateRouteMiddleware'
    //   );
    // }

    // проверка на валидность userId
    if (! Types.ObjectId.isValid(tokenPayload.id)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${tokenPayload.id} is invalid offer id`,
        'AuthorMiddleware'
      );
    }

    const offer = await this.service.exists(tokenPayload.id);

    if (! offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with ${tokenPayload.id} not found.`,
        'AuthorisationMiddleware'
      );
    }

    next();
  }
}

