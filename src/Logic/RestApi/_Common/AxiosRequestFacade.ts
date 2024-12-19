/* eslint-disable no-console */

import { AppError, HttpError } from '../../../Infrastructure/Exceptions/Errors'
import Axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { joiType, validateResponse } from './ValidateResponse'

import { AxiosConfigBuilder } from './AxiosConfigBuilder'
import { Either } from 'purify-ts/Either'
import { EitherAsync } from 'purify-ts/EitherAsync'
import dayjs from 'dayjs'
import { globalContext } from '../../../DependencyInjection/AppContext'
import { refreshTokenPolicyAsync } from './RefreshTokenPolicy'

export class AxiosRequestFacade {

	private readonly eventBus = globalContext.eventBus.value
	private readonly position = 'http-запросы'
	private readonly dateInitiated = new Date()

	constructor(private readonly _builder: AxiosConfigBuilder) {}


	private readonly performAsync = async <T> (config: AxiosRequestConfig) => {
		const log = __DEV__
		if (log) {
			console.log('request url: ', config.url)
			console.log('request body', JSON.stringify(config.data))
		}

		const source = Axios.CancelToken.source()
		const timeout = setTimeout(() => {
			source.cancel()
		  }, config.timeout)

		const result = await EitherAsync(() => Axios.request<T>({
			...config,
			cancelToken: source.token,
		})).run()
		const decimalPlaces = 2

		this.eventBus.emit({
			analyticsCategory: 'IgnoreEvent',
			moduleName: 'Axios Facade',
			screenName: this.position,
			functionalityName: config.url ?? 'unknown url',
			suppressUserError: true,
			result: result.map(response => ({
				data: response.data,
				requestDate: this.dateInitiated,
				responseDate: new Date(),
				lengthInSeconds: dayjs().diff(dayjs(this.dateInitiated), 'second').toFixed(decimalPlaces),
				request: {
					url: config.url,
					body: config.data,
				},
			}))
			.mapLeft(error =>
				new HttpError(error as AxiosError, new Date())
			),
		})

		return result.mapLeft(err => {
			clearTimeout(timeout)
			return new HttpError(err as AxiosError)
		})
		.map(response => {
			if (log) {
				console.log('response', JSON.stringify(response.data))
			}
			clearTimeout(timeout)
			const data =
				(response.data as unknown) === '' ? null : response.data
			return data as T
		})
	}

	private readonly performWithToken = <T> (token: string) => {
		const config = this._builder.withToken(token).build()
		return this.performAsync<T>(config)
	}

	performDefaultAsync = async <T>(joiScheme?: joiType): Promise<{
		value: Either<AppError, T>
		url?: string
		method?: string
		urlBody?: string
	}> => {
		const resultEither = await  this.performAsync<T>(this._builder.build())
		if (resultEither.isRight() && joiScheme) {
			return this.fillDataWithConfig(await validateResponse(resultEither.unsafeCoerce(), joiScheme))
		}

		return this.fillDataWithConfig(resultEither)
	}


	performWithRefreshTokenPolicyAsync = async <T> (joiScheme?: joiType): Promise<{
		value: Either<AppError, T>
		url?: string
		method?: string
		urlBody?: string
	}> => {
		const resultEither = await refreshTokenPolicyAsync<T>(this.performWithToken)
		if (resultEither.isRight() && joiScheme) {
			return this.fillDataWithConfig(await validateResponse(resultEither.unsafeCoerce(),  joiScheme))
		}
		return this.fillDataWithConfig(resultEither)
	}

	fillDataWithConfig = <T>(either: Either<AppError, T>) => {
		const { url, method } = this._builder.config
		const urlBody = JSON.stringify(this._builder.config.data)
		return { value: either, url, method, urlBody }
	}

}
