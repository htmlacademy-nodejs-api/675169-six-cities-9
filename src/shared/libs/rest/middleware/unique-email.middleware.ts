import { NextFunction, Request, Response } from 'express';
import { HttpError, Middleware } from '../index.js';
import { StatusCodes } from 'http-status-codes';
import { UniqueProperty } from '../../../types/index.js';

export class UniqueEmailMiddleware implements Middleware {
  constructor(
    private readonly service: UniqueProperty,
    private readonly entityName: string,
    private readonly paramName: string,
    private readonly shouldExist: boolean
  ) {}

  public async execute({ body }: Request, _res: Response, next: NextFunction): Promise<void> {
    const email = body[this.paramName];

    const existed = await this.service.emailExists(email);

    if (this.shouldExist ? !existed : existed) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `${email} ${this.shouldExist ? 'does not exist' : 'already exists'} in ${this.entityName} database`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
