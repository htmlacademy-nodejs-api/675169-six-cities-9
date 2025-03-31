
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IsAuthor } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { Middleware } from '../index.js';

export class AuthorMiddleware implements Middleware {
  constructor(
    private readonly service: IsAuthor,
    private readonly entityName: string,
    private readonly paramOfferId: string,
  ) {}

  public async execute({ params, tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    const userId = tokenPayload.id;
    const offerId = params[this.paramOfferId];

    const isAuthor = await this.service.isOfferAuthor(userId, offerId);

    if (!isAuthor) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,

        `User with ${userId} is not the author of ${this.entityName} with ${offerId}`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}

