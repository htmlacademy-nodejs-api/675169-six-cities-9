import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, DocumentExistsMiddleware, HttpMethod, ValidateCityMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferDto, CreateOfferRequest, OfferRdo, ParamCity, ParamOfferId } from './index.js';
import { EditOfferRequest, ParamUserIdOfferId, UserService } from '../user/index.js';
import { AuthorMiddleware } from '../../libs/rest/middleware/author.middleware.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

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
          new ValidateDtoMiddleware(CreateOfferDto)
        ]
      },
      {
        path: '/:offerId/',
        method: HttpMethod.Get,
        handler: this.show,
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
        ]
      },
      {
        path: '/:offerId/users/:userId',
        method: HttpMethod.Put,
        handler: this.update,
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new ValidateObjectIdMiddleware('userId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
          new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
          new AuthorMiddleware(this.offerService, 'Offer', 'userId', 'offerId'),
          new ValidateDtoMiddleware(CreateOfferDto),
        ]
      },
      {
        path: '/:offerId/users/:userId',
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new ValidateObjectIdMiddleware('userId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
          new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
          new AuthorMiddleware(this.offerService, 'Offer', 'userId', 'offerId'),
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

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async update({ params, body }: EditOfferRequest, res: Response): Promise<void> {
    // TODO проверка на автора в middleware
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    const responseData = fillDTO(OfferRdo, updatedOffer);
    this.ok(res, responseData);
  }

  public async delete({ params }: Request<ParamUserIdOfferId>, res: Response): Promise<void> {
    // TODO проверка на автора в middleware

    await this.offerService.deleteById(params.offerId);

    this.okNoContent(res);
  }

  public async indexPremium({ params }: Request<ParamCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }
}
