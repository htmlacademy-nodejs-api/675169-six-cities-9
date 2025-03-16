import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, DocumentExistsMiddleware, UniqueEmailMiddleware, HttpError, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, UploadFileMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { ChangeFavoriteRequest, CreateUserDto, CreateUserRequest, LoginUserRequest, ParamUserId} from './index.js';
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
      {
        path: '/register',
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          new UniqueEmailMiddleware(this.userService, 'User', 'email', false),
          new ValidateDtoMiddleware(CreateUserDto),
        ]
      },
      {
        path: '/login',
        method: HttpMethod.Post,
        handler: this.login,
        middlewares: [
          new UniqueEmailMiddleware(this.userService, 'User', 'email', true),
        ]
      },
      { path: '/logout', method: HttpMethod.Post, handler: this.logout },
      { path: '/status', method: HttpMethod.Get, handler: this.status },
      {
        path: '/favorites/:userId',
        method: HttpMethod.Get,
        handler: this.indexFavorites,
        middlewares: [
          new ValidateObjectIdMiddleware('userId'),
        ]
      },
      {
        path: '/favorites/:userId/offers/:offerId',
        method: HttpMethod.Put,
        handler: this.update,
        middlewares: [
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
          new DocumentExistsMiddleware(this.userService, 'User', 'userId')
        ]
      },
      {
        path: '/:userId/avatar',
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new ValidateObjectIdMiddleware('userId'),
          new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
          new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
        ]
      }
    ];

    this.addRoute(routes);
  }

  public async update({ body, params }: ChangeFavoriteRequest, res: Response): Promise<void> {
    const { isAdding } = body;

    const updatedUser = await this.userService.addToOrRemoveFromFavoritesById(params.userId, params.offerId, isAdding);
    const responseData = fillDTO(UserRdo, updatedUser);
    this.ok(res, responseData);
  }

  public async indexFavorites({ params }: Request<ParamUserId>, res: Response): Promise<void> {
    const offers = await this.userService.getAllFavorites(params.userId);

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async login(
    _req: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    this.okNoContent(res);
  }

  public async status({ body }: LoginUserRequest, res: Response) {
    // TODO: Проверка состояния пользователя или не надо?
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

  public async logout({ body }: LoginUserRequest, res: Response): Promise<void> {
    // TODO: Выход из авторизированного режима
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
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
