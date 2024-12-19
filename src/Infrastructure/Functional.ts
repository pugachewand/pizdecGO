import { AppError, HttpError, UnexpectedError } from './Exceptions/Errors'

import { Either } from 'purify-ts/Either'

export type PromiseEither<L, R> = Promise<Either<L, R>>

export type HttpPromise<R> = PromiseEither<HttpError, R>
export type StoragePromise<R> = PromiseEither<UnexpectedError, R>
export type AppPromise<R> = PromiseEither<AppError, R>
