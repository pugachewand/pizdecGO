import { AxiosError } from 'axios'
import { EventLevel } from '../../Logic/EventBus/Event'
import { StatusCodes } from 'http-status-codes'
import { isString } from 'lodash-es'

export abstract class AppError { }

export class MissingCredentialsInStorageError extends AppError { }

export type AlertData =  {
	title: string
	description: string
	subDescription?: string
	level?: EventLevel
	isConnectionError?: boolean
	isConnectionTerminalWithBank?: boolean
}

export class CustomUserError extends AppError {
	constructor(readonly alertData: AlertData) {
		super()
	}
}

type ErrorAndDescription = {
	error: string
	description: string
}

export class UnexpectedError extends AppError {
	readonly errorStack: ErrorAndDescription[] = []

	constructor(...errors: ErrorAndDescription[]) {
		super()
		errors.forEach(err => this.errorStack.push(err))
	}
}

export class HttpError extends AppError {

	private static readonly notExistPattern = /UserProfile\s.+not\sexists/

	private static readonly connectionTimeoutPattern = /timeout of \d+ms exceeded/

	constructor(readonly axiosError: AxiosError, readonly responseDate?: Date) {
		super()
	}

	get isNoConnection() {
		return this.axiosError.message === 'Network Error'
			|| this.axiosError.response?.status === StatusCodes.SERVICE_UNAVAILABLE
	}

	get isTimeOut() {
		return HttpError.connectionTimeoutPattern.test(this.axiosError.message)
		|| this.axiosError.response?.status === StatusCodes.REQUEST_TIMEOUT
		|| this.axiosError.response?.status === StatusCodes.GATEWAY_TIMEOUT
	}

	get isUnauthorized() {
		const status = this.axiosError.response?.status
		return status === StatusCodes.UNAUTHORIZED
			|| status === StatusCodes.BAD_REQUEST && JSON.stringify(this.axiosError.response?.data).includes('invalid_grant')
			|| this.profileSomehowNotExists
	}
	get isRefreshTokenOut() {
		const status = this.axiosError.response?.status
		return status === StatusCodes.BAD_REQUEST && JSON.stringify(this.axiosError.response?.data).includes('invalid_grant')
	}
	get isTokenExpired() {
		const status = this.axiosError.response?.status
		return status === StatusCodes.BAD_REQUEST && JSON.stringify(this.axiosError.response?.data).includes('token has expired')
	}

	get isForbiddenByServer() {
		const status = this.axiosError.response?.status
		return status === StatusCodes.FORBIDDEN
	 }

	get profileSomehowNotExists() {
		return this.axiosError.response?.status === StatusCodes.BAD_REQUEST
			&& isString(this.axiosError.response.data) && HttpError.notExistPattern.test(this.axiosError.response.data)
	}

	get isUserHaveUnpaidCheck() {
		const status = this.axiosError.response?.status
		return status === StatusCodes.BAD_REQUEST && JSON.stringify(this.axiosError.response?.data).includes('Sorry, but you can\'t delete the card, because you have an unpaid purchase.')
	}
	get isBackendError() {
		const status = undefined
		return status === undefined && this.axiosError.response?.data === undefined
	}
	get isDdosError() {
		return this.axiosError.response?.status === StatusCodes.TOO_MANY_REQUESTS
	}
	get isGatewayError() {
		return JSON.stringify(this.axiosError.response?.data).includes('get payment service for brand')
	}

}

export class TerminalDeviceIsNotReady extends AppError { }

export class IsNotReadyToPayViaAppleError extends AppError { }

export class GooglePayError extends AppError {
	constructor(readonly error: Error) {
		super()
	}
}

export class UnknownAxiosError extends HttpError {
	constructor(readonly error: AxiosError) {
		super(error)
	}
}

type CloudPaymentCardErrorType = 'wrong-number' | 'wrong-date'

export class CloudPaymentsCardError extends AppError {
	constructor(readonly errorType: CloudPaymentCardErrorType) {
		super()
	}
}

export class HttpValidationError extends AppError {
	static fromJoiError(error: Error) {
		return new this({
			description: error.message,
			error: error.name,
		})
	}

	private constructor(readonly error: ErrorAndDescription) {
		super()
	}
}

