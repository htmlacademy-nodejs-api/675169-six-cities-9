import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { AuthorisationMiddleware, AuthorMiddleware, BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateCityMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferDto, CreateOfferRequest, EditOfferDto, OfferRdo, ParamCity, ParamOfferId } from './index.js';
import { EditOfferRequest, UserService } from '../user/index.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    const offerMiddlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
    ];

    const userMiddlewares = [
      new PrivateRouteMiddleware(),
      new AuthorisationMiddleware(this.userService),
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
          ...userMiddlewares,
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
          ...userMiddlewares,
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
          ...userMiddlewares,
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

  public async index({ tokenPayload }: Request, res: Response): Promise<void> {
    const userId = tokenPayload ? tokenPayload.id : null;
    const offers = await this.offerService.find(userId);

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const comforts = [...new Set(body.comforts)];
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id, comforts });

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const userId = tokenPayload ? tokenPayload.id : null;

    const offer = await this.offerService.findById(userId, params.offerId);
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

    this.okNoContent(res);
  }

  public async indexPremium({ params, tokenPayload }: Request<ParamCity>, res: Response): Promise<void> {
    const userId = tokenPayload ? tokenPayload.id : null;

    const offers = await this.offerService.findPremiumByCity(userId, params.city);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }
}
