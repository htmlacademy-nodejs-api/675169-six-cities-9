import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { ChangeFavoriteRequest, CreateUserRequest, LoginUserRequest, ParamUserId} from './index.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { OfferRdo, OfferService } from '../offer/index.js';


@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    const routes = [
      { path: '/register', method: HttpMethod.Post, handler: this.create },
      { path: '/login', method: HttpMethod.Post, handler: this.login },
      { path: '/logout', method: HttpMethod.Post, handler: this.logout },
      { path: '/status', method: HttpMethod.Get, handler: this.status },
      {
        path: '/favorites/:userId',
        method: HttpMethod.Get,
        handler: this.indexFavorites,
        middlewares: [new ValidateObjectIdMiddleware('userId')]
      },
      { path: '/favorites', method: HttpMethod.Put, handler: this.update },
    ];

    this.addRoute(routes);
  }

  public async update({ body }: ChangeFavoriteRequest, res: Response): Promise<void> {
    const { userId, offerId, isAdding } = body;

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'UserController',
      );
    }

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'UserController',
      );
    }

    const updatedUser = await this.userService.addToOrRemoveFromFavoritesById(userId, offerId, isAdding);

    const responseData = fillDTO(UserRdo, updatedUser);
    this.ok(res, responseData);
  }

  public async indexFavorites({ params }: Request<ParamUserId>, res: Response): Promise<void> {
    const user = await this.userService.findById(params.userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with id ${params.userId} not found.`,
        'UserController',
      );
    }
    const offers = await this.userService.getAllFavorites(params.userId);

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${body.email} was not found.`,
        'UserController',
      );
    }

    this.okNoContent(res);
  }

  public async status({ body }: LoginUserRequest, res: Response) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${body.email} was not found.`,
        'UserController',
      );
    }

    // TODO: Проверка состояния пользователя или не надо?

    this.okNoContent(res);
  }

  public async logout({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${body.email} was not found.`,
        'UserController',
      );
    }

    this.okNoContent(res);
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }
}
