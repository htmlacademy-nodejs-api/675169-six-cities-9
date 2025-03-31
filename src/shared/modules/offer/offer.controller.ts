import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { AuthorisationMiddleware, AuthorMiddleware, BaseController, DocumentExistsMiddleware, HttpMethod, ValidateCityMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferDto, CreateOfferRequest, EditOfferDto, OfferRdo, ParamCity, ParamOfferId } from './index.js';
import { EditOfferRequest } from '../user/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UserService } from '../user/index.js';
import { CommentService } from '../comment/index.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,

    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    const offerMiddlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
    ];

    const routes = [
      {
        path: '/',
        method: HttpMethod.Get,
        handler: this.index
      },
      {
        path: '/',
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
          new ValidateDtoMiddleware(CreateOfferDto)
        ]
      },
      {
        path: '/:offerId/',
        method: HttpMethod.Get,
        handler: this.show,
        middlewares: offerMiddlewares
      },

      {
        path: '/:offerId',
        method: HttpMethod.Put,
        handler: this.update,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
          ...offerMiddlewares,
          new AuthorMiddleware(this.offerService, 'Offer', 'offerId'),
          new ValidateDtoMiddleware(EditOfferDto),
        ]
      },
      {
        path: '/:offerId',
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [
          new AuthorisationMiddleware(this.config.get('JWT_SECRET'), this.userService),
          ...offerMiddlewares,
          new AuthorMiddleware(this.offerService, 'Offer', 'offerId'),
        ]
      },
      {
        path: '/premium/:city',
        method: HttpMethod.Get,
        handler: this.indexPremium,
        middlewares: [new ValidateCityMiddleware('city')]
      }
    ];

    this.addRoute(routes);

  }

  public async index({ tokenPayload: { id } }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(id ?? null);

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const comforts = [...new Set(body.comforts)].sort();
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id, comforts });

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show({ params, tokenPayload: { id } }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.findById((id ?? null), params.offerId);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async update({ params, body }: EditOfferRequest, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    const responseData = fillDTO(OfferRdo, updatedOffer);
    this.ok(res, responseData);
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteAllByOfferId(params.offerId);
    this.okNoContent(res);
  }

  public async indexPremium({ params, tokenPayload: { id } }: Request<ParamCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity((id ?? null), params.city);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }
}
