import {
	AppError,
	HttpError,
	MissingCredentialsInStorageError,
} from '../../../Infrastructure/Exceptions/Errors'
import { Either, Left, Right } from 'purify-ts/Either'
import { RefreshTokenResponseEntity, generateRefreshTokenRequest } from '../Auth/AuthRepo.Types'

import { UserCredentials } from '../../../Infrastructure/Auth/UserCredentials'
import dayjs from 'dayjs'
import { getResponseSeconds } from '../../Date/getDifferenceOfDates'
import { globalContext } from '../../../DependencyInjection/AppContext'
import { when } from 'mobx'

const credentialsOrError = (): Either<MissingCredentialsInStorageError, UserCredentials> => {
	const authStore = globalContext.preferences.value
	return !authStore.isAuthorized || !authStore.credentials
		? Left(new MissingCredentialsInStorageError())
		: Right(authStore.credentials)
}

export const refreshTokenPolicyAsync = async <T>(
	action: (token: string) => Promise<Either<HttpError, T>>
): Promise<Either<AppError, T>> => {
	await when(() => globalContext.preferences.value.lceState !== 'loading')

	const authRepo = globalContext.restRepos.auth.value
	const preferences = globalContext.preferences.value
	const eventBus = globalContext.eventBus.value
	const screen = 'Политика обновления токена'

	const credsEither = credentialsOrError()
	if (credsEither.isLeft()) {
		return credsEither
	}

	const creds = credsEither.unsafeCoerce()
	const { authTokenExpireDate } = creds

	if (dayjs(authTokenExpireDate).isAfter(dayjs())) {
		const actionResult = await action(creds.authToken)
		if (actionResult.isRight() ||
			!actionResult.swap().unsafeCoerce().isUnauthorized
		) {
			return actionResult
		}
	}

	const requestDate = new Date()
	const refreshEither = await authRepo.refreshToken(
		generateRefreshTokenRequest(creds.refreshToken, creds.scope)
	)
	const responseDate = new Date()
	const time = getResponseSeconds(responseDate, requestDate)
	if (refreshEither.value.isLeft()) {
		eventBus.emit({
			analyticsCategory: 'IgnoreEvent',
			functionalityName: 'Истечение refreshToken, возврат на авторизацию',
			suppressUserError: true,
			result: Left(refreshEither.value),
			screenName: screen,
			moduleName: 'Запуск приложения',
			requestUrl: refreshEither.url,
			requestBody: refreshEither.urlBody,
			requestMethod: refreshEither.method,
			requestDate: requestDate.toISOString(),
			responseDate: responseDate.toISOString(),
			requestProcessingTime: time,
		})
		await globalContext.preferences.value.forgetCredentials()
		return refreshEither.value
	}

	const tokenData = refreshEither.value.unsafeCoerce()
	if (!tokenData.refresh_token) {
		eventBus.emit({
			analyticsCategory: 'IgnoreEvent',
			functionalityName: 'Истечение accessToken, запрос на новый accessToken',
			result: Right(null),
			screenName: screen,
			moduleName: 'Запуск приложения',
			requestUrl: refreshEither.url,
			requestBody: refreshEither.urlBody,
			requestMethod: refreshEither.method,
			requestDate: requestDate.toISOString(),
			responseDate: responseDate.toISOString(),
			requestProcessingTime: time,
			suppressUserError: true,
		})
	}

	const newCredentials: RefreshTokenResponseEntity = {
		...tokenData,
		refresh_token: tokenData.refresh_token ?? creds.refreshToken,
		scope: creds.scope,
	}

	await preferences.setCredentials(newCredentials)
	return action(newCredentials.access_token)
}
