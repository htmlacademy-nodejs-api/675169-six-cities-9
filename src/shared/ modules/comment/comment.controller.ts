import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../enums/index.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from './comment-service.interface.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateCommentRequest } from './create-comment-request.type.js';
import { ParamOfferId } from '../offer/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    const routes = [
      { path: '/:offerId', method: HttpMethod.Get, handler: this.index },
      { path: '/', method: HttpMethod.Post, handler: this.create },
      { path: '/:offerId', method: HttpMethod.Delete, handler: this.delete },
    ];
    this.addRoute(routes);
  }

  public async create({ body }: CreateCommentRequest, res: Response): Promise<void> {
    const comment = await this.commentService.create(body);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async index({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findAllByOfferId(params.offerId);

    if (!comments) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} does not have comments.`,
        'CommentController',
      );
    }

    const responseData = fillDTO(CommentRdo, comments);
    this.ok(res, responseData);
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const deleted = await this.commentService.deleteAllByOfferId(params.offerId);

    this.noContent(res, deleted);
  }

}
