import { AppError, HttpError } from '../../../Infrastructure/Exceptions/Errors'

import { ErrorViewI18n } from '../../../I18n/_Common/ErrorView/ErrorView.i18n'

export class ErrorViewStore {
	constructor(private readonly i18n: ErrorViewI18n, public customText?: string, public error?:  AppError) {
	}

	get errorMessage(): string {
		if (this.error instanceof HttpError && this.error.isNoConnection) {
			return this.i18n.noInternetConnection
		}
		return this.customText ?? this.i18n.message
	}
}