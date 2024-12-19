import { Either, Left, Right } from 'purify-ts/Either'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { HttpValidationError } from '../../../Infrastructure/Exceptions/Errors'
import Joi from 'joi'


export type joiType = Joi.ObjectSchema | Joi.ArraySchema


export const validateResponse = <T> (data: T, scheme: joiType): Promise<Either<HttpValidationError, T>> => {

	const result = scheme.validate(data, {
		convert: false,
	})
	const either = result.error
		 ? Left(HttpValidationError.fromJoiError(result.error))
		 : Right(data)

	return EitherAsync.liftEither(either).run()
}
