import { DatesI18n } from './Dates/Dates.i18n'

export type CommonI18n = {
	buttons: {
		close: string
		cancel: string
		dontCancel: string
		cancelPurchase: string
		continue: string
		goBack: string
		OK: string
		edit: string
		yes: string
		no: string
		repeat: string
		repeatPay: string
		pay: string
		start: string
	}
	texts: {
		termsUrl: string | undefined
		checkNumber: (number: number) => string
	}
	errors: {
		noInternetConnection: string
		unknownErrorTitle: string
		pleaseTryAgain: string
		unauthorizedTitle: string
		error: string
		tryingToReconnect: string
		tryAgainLater: string
		bugReportReceived: string
		tokenExpired: string
		logInAgain: string
		bankCardDeleteTitle: string
		haveUnpaidCheck: string
		timeOut: string
		userIsBlocked: string
		tooManyAuthTitle: string
		tooManyAuth: string
		testWriteOff: string

	}
	dates: DatesI18n
}
