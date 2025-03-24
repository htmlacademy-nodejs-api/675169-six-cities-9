import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';

import { createSecretKey } from 'node:crypto';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { TokenPayload } from '../../../modules/auth/index.js';
import { DocumentExists } from '../../../types/index.js';


function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    (typeof payload === 'object' && payload !== null) &&
    ('email' in payload && typeof payload.email === 'string') &&
    ('name' in payload && typeof payload.name === 'string') &&
    ('id' in payload && typeof payload.id === 'string')
  );
}

export class AuthorisationMiddleware implements Middleware {
  constructor(
    private readonly jwtSecret: string,
     private readonly service: DocumentExists,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {

    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));

      if (isTokenPayload(payload)) {

        const user = await this.service.exists(payload.id);

        if (! user) {
          throw new HttpError(
            StatusCodes.NOT_FOUND,
            `User with ${payload.id} not found.`,
            'AuthorisationMiddleware'
          );
        }

        req.tokenPayload = { ...payload };
        return next();
      } else {
        throw new Error('Bad token');
      }
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthorisationMiddleware')
      );
    }
  }
}
