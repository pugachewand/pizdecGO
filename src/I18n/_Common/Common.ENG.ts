import { CommonI18n } from './Common.i18n'
import Config from 'react-native-config'

import { DatesENG } from './Dates/Dates.ENG'

export const CommonENG: CommonI18n = {
	buttons: {
		OK: 'OK',
		cancel: 'Cancel',
		cancelPurchase: 'Cancel purchase',
		continue: 'Continue',
		goBack: 'Back',
		edit: 'Edit',
		yes: 'Yes',
		no: 'No',
		repeat: 'Repeat',
		repeatPay: 'Repeat payment',
		close: 'Close',
		dontCancel: 'Don\'t close',
		pay: 'Pay',
		start: 'Start',
	},
	texts: {
		termsUrl: Config.TERMS_URL_ENG,
		checkNumber: number => `№ ${number}`,
	},
	errors: {
		noInternetConnection: 'No internet connection.',
		unknownErrorTitle: 'An unexpected error occurred',
		pleaseTryAgain: 'Please try again',
		tryAgainLater: 'Please try again later',
		unauthorizedTitle: 'Please login',
		error: 'Error',
		tryingToReconnect: 'Trying to reconnect',
		bugReportReceived: 'We have already sent a bug data to the application developers. Please try again later',
		tokenExpired: 'Your session has timed out.',
		logInAgain: 'Please, login again.',
		bankCardDeleteTitle: 'Sorry, you cannot delete the active card,',
		haveUnpaidCheck: 'you have an unpaid purchase.',
		timeOut: 'Processing operation ...',
		userIsBlocked: 'Sorry, your account has been blocked. Please contact support.',
		tooManyAuthTitle: 'Too many attempts.',
		tooManyAuth: 'Please repeat later.',
		testWriteOff: 'Failed to test debiting from the card. Please contact support.',
	},
	dates: DatesENG,
}
