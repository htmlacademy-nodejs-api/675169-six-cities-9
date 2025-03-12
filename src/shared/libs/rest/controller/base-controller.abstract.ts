import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';

import { Controller } from './controller.interface.js';
import { Logger } from '../../logger/index.js';
import { Route } from '../types/route.interface.js';
import asyncHandler from 'express-async-handler';

@injectable()
export abstract class BaseController implements Controller {
  private readonly DEFAULT_CONTENT_TYPE = 'application/json';
  private readonly _router: Router;

  constructor(
    protected readonly logger: Logger
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route | Route[]) {
    const routes = [route].flat(2);

    for (const routeItem of routes) {
      const wrapperAsyncHandler = asyncHandler(routeItem.handler.bind(this));

      const middlewareHandlers = routeItem.middlewares?.map((item) => asyncHandler(item.execute.bind(item)));
      const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;

      this._router[routeItem.method](routeItem.path, allHandlers);

      this.logger.info(`Route registered: ${routeItem.method.toUpperCase()} ${routeItem.path}`);
    }
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type(this.DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public okNoContent(res: Response): void {
    this.send(res, StatusCodes.OK, { ok: true});
  }
}
