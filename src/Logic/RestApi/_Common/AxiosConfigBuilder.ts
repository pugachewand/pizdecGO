import Axios, { AxiosRequestConfig, Method } from 'axios'
import { isArray, isObject, isString, map } from 'lodash-es'

import { AxiosRequestFacade } from './AxiosRequestFacade'
import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import { globalContext } from '../../../DependencyInjection/AppContext'
import { isIso8601 } from '../../Date/IsIso8601'
import { toUrlEncoded } from './ToUrlEncoded'
import { valueAsArray } from '../../Types/ValueAsArray'

export class AxiosConfigBuilder {

	private static readonly defaultTimeout = 15000

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static readonly parseDateFields = (data: any): any => {
		if (isString(data)) {
			return isIso8601(data) ? dayjs(data).toDate() : data
		}

		if (isArray(data)) {
			return map(data, value => AxiosConfigBuilder.parseDateFields(value))
		}

		if (isObject(data)) {
			Object.keys(data).forEach(
				key =>
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(data as any)[key] = AxiosConfigBuilder.parseDateFields(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(data as any)[key],
					),
			)
			return data
		}

		return data
	}

	private readonly url: string
	private readonly method: Method
	config: AxiosRequestConfig

	private readonly _constants = globalContext.preferences.value.environmentVariables

	constructor(url: string, method: Method) {
		this.validateUrl(url)
		this.url = url
		this.method = method
		this.config = this.makeConfig()
	}

	private readonly validateUrl = (url: string) => {
		if (!url.startsWith('/')) {
			throw new Error('URL should start with "/"')
		}
	}

	private readonly makeConfig = (): AxiosRequestConfig => ({
		validateStatus: code => [StatusCodes.OK, StatusCodes.CREATED].includes(code),
		// Именно в таком порядке, чтобы не поймать ошибку
		transformResponse: [
			...valueAsArray(Axios.defaults.transformResponse),
			AxiosConfigBuilder.parseDateFields,
		],
		url: this._constants.apiUrl + this.url,
		method: this.method,
		timeout: AxiosConfigBuilder.defaultTimeout,
		data: undefined,
	})

	build = () => this.config

	withToken = (token: string) => {
		this.config = {
			...this.config,
			headers: {
				...this.config.headers,
				Authorization: `Bearer ${token}`,
			},
		}
		return this
	}

	withJson = (data: object) => {
		this.config = {
			...this.config,
			headers: {
				...this.config.headers,
				'Content-Type': 'application/json',
			},
			data: JSON.stringify(data),
		}
		return this
	}

	withUrlEncoded = (data: object) => {
		this.config = {
			...this.config,
			headers: {
				...this.config.headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: toUrlEncoded(data),
		}
		return this
	}
	
	withAllowedHttpCodes = (...codes: number[]) => {
		this.config = {
			...this.config,
			validateStatus: status =>
				status >= StatusCodes.OK && status < StatusCodes.MULTIPLE_CHOICES || codes.includes(status),
		}

		return this
	}

	withTimeout = (timeout: number) => {
		this.config = {
			...this.config,
			timeout,
		}
		return this
	}

	toRequest = () => new AxiosRequestFacade(this)
}
