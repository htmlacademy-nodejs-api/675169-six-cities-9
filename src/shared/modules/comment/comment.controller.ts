import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { AuthorisationMiddleware, AuthorMiddleware, BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateCommentRequest } from './create-comment-request.type.js';
import { OfferService, ParamOfferId } from '../offer/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UserService } from '../user/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController..');

    const userMiddlewares = [
      new PrivateRouteMiddleware(),
      new AuthorisationMiddleware(this.userService),
    ];

    const offerMiddlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
    ];

    const routes = [
      {
        path: '/:offerId',
        method: HttpMethod.Get,
        handler: this.index,
        middlewares: offerMiddlewares
      },
      {
        path: '/:offerId',
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          ...userMiddlewares,
          ...offerMiddlewares,
          new ValidateDtoMiddleware(CreateCommentDto)
        ]
      },
      {
        path: '/:offerId',
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [
          ...userMiddlewares,
          new AuthorMiddleware(this.offerService, 'Offer', 'offerId'),
          ...offerMiddlewares
        ]
      },
    ];
    this.addRoute(routes);
  }

  public async create({ body, tokenPayload, params }: CreateCommentRequest, res: Response): Promise<void> {
    const comment = await this.commentService.create({ ...body, author: tokenPayload.id, offerId: params.offerId });

    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async index({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findAllByOfferId(params.offerId);
    const responseData = fillDTO(CommentRdo, comments);
    this.ok(res, responseData);
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const deleted = await this.commentService.deleteAllByOfferId(params.offerId);

    this.noContent(res, deleted);
  }

}
