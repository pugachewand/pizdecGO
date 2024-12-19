import { AppEvent } from '../Event'
import { CustomUserError, HttpError } from '../../../Infrastructure/Exceptions/Errors'

import { Subscriber } from './Subscribers.Types'
import { debounce } from 'lodash-es'
import { globalContext } from '../../../DependencyInjection/AppContext'
import ModalController from '../../../Components/_Common/Modal/CustomAlertModalController'

// eslint-disable-next-line sonarjs/cognitive-complexity
const eventHandler = (event: AppEvent): void => {
	if (event.result.isRight()) {
		return
	}
	const commoni18n = globalContext.preferences.value.i18n.common.value
	const error = event.result.swap().unsafeCoerce()
	const dropdownRef = globalContext.alertDropdownRef.value.current
	if (!dropdownRef) {
		return
	}
	if (error instanceof CustomUserError) {
		const { alertData } = error
		ModalController.showModal(alertData)
	}
	else if (error instanceof HttpError && error.isNoConnection) {
		ModalController.showModal({
			title: commoni18n.errors.noInternetConnection,
			description: commoni18n.errors.tryAgainLater,
		})
	}
	else if (error instanceof HttpError && error.isTimeOut) {
		ModalController.showModal({
			title: commoni18n.errors.timeOut,
			description: '',
		})
	}
	else if (error instanceof HttpError && (error.isTokenExpired || error.isRefreshTokenOut)) {
		ModalController.showModal({
			title: commoni18n.errors.tokenExpired,
			description: commoni18n.errors.logInAgain,
		})
	}
	else if (error instanceof HttpError && error.isUserHaveUnpaidCheck) {
		ModalController.showModal({
			title: commoni18n.errors.bankCardDeleteTitle,
			description: commoni18n.errors.haveUnpaidCheck,
		})
	}
	else if (error instanceof HttpError && error.isBackendError) {
		// reportMetrica('Axios undefined error', {
		// 	URL: event.requestUrl,
		// },)
	}
	else if (error instanceof HttpError && error.isDdosError) {
		ModalController.showModal({
			title: commoni18n.errors.tooManyAuthTitle,
			description: commoni18n.errors.tooManyAuth
		})
	}
	else {
		ModalController.showModal({
			title: commoni18n.errors.unknownErrorTitle,
			description: commoni18n.errors.bugReportReceived,
		})
	}
}

const interval = 2000
const debouncedEventHandler = debounce(eventHandler, interval, { leading: true })

export const errorUserAlertSubscriber: Subscriber = {
	id: Symbol(),
	execute: debouncedEventHandler,
	predicate: event => event.result.isLeft() && event.suppressUserError !== true,
}
