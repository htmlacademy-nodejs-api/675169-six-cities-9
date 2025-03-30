import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, UniqueEmailMiddleware, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, UploadFileMiddleware, AuthorisationMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { ChangeFavoriteRequest, CreateUserDto, CreateUserRequest, LoginUserRequest, ParamUserId} from './index.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { OfferRdo, OfferService } from '../offer/index.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
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
      {
        path: '/profile',
        method: HttpMethod.Get,
        handler: this.profile,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
        ]
      },
      {
        path: '/logout',
        method: HttpMethod.Post,
        handler: this.logout,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
        ]
      },
      {
        path: '/favorites',
        method: HttpMethod.Get,
        handler: this.indexFavorites,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
        ]
      },
      {
        path: '/favorites/:offerId',
        method: HttpMethod.Put,
        handler: this.update,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        ]
      },
      {
        path: '/avatar',
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
          new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
        ]
      }
    ];

    this.addRoute(routes);
  }

  public async update({ params, tokenPayload }: ChangeFavoriteRequest, res: Response): Promise<void> {
    const updatedUser = await this.userService.addOrRemoveFromFavoritesById(tokenPayload.id, params.offerId);
    const responseData = fillDTO(UserRdo, updatedUser);
    this.ok(res, responseData);
  }

  public async indexFavorites({ tokenPayload }: Request<ParamUserId>, res: Response): Promise<void> {
    const offers = await this.userService.getAllFavorites(tokenPayload.id);

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {

    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);

    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }


  public async logout(_req: LoginUserRequest, res: Response): Promise<void> {
    this.okNoContent(res);
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async uploadAvatar({ file, tokenPayload }: Request, res: Response) {
    console.log('tokenPayload', tokenPayload);
    const { id } = tokenPayload;


    const uploadFile = { image: file?.filename };
    await this.userService.updateById(id, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarRdo, { filepath: uploadFile.image }));
  }

  public async profile({ tokenPayload: { email }}: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }
}
