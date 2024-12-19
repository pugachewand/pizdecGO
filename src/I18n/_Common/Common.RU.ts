import { CommonI18n } from './Common.i18n'
import Config from 'react-native-config'
import { DatesRU } from './Dates/Dates.RU'

export const CommonRU: CommonI18n = {
	buttons: {
		close: 'Закрыть',
		OK: 'OK',
		cancel: 'Отменить',
		cancelPurchase: 'Отменить покупку',
		dontCancel: 'Не отменять',
		continue: 'Продолжить',
		goBack: 'Назад',
		edit: 'Изменить',
		yes: 'Да',
		no: 'Нет',
		repeat: 'Повторить',
		pay: 'Оплатить',
		repeatPay: 'Повторить оплату',
		start: 'Начать',
	},
	texts: {
		termsUrl: Config.TERMS_URL_RU,
		checkNumber: number => `№ ${number}`,
	},
	errors: {
		noInternetConnection: 'Нет соединения с интернетом.',
		unknownErrorTitle: 'Возникла непредвиденная ошибка',
		pleaseTryAgain: 'Попробуйте, пожалуйста, снова',
		tryAgainLater: 'Попробуйте снова чуть позже',
		unauthorizedTitle: 'Залогиньтесь, пожалуйста',
		error: 'Ошибка',
		tryingToReconnect: 'Пытаемся переподключиться',
		bugReportReceived: 'Мы отправили данные об ошибке авторам приложения. Попробуйте, пожалуйста, чуть позже снова',
		tokenExpired: 'Время вашей сессии истекло.',
		logInAgain: 'Залогиньтесь, пожалуйста, заново.',
		bankCardDeleteTitle: 'Извините, но вы не можете удалить активную карту, ',
		haveUnpaidCheck: 'потому что у вас есть неоплаченная покупка.',
		timeOut: 'Идет обработка операции...',
		userIsBlocked: 'Сожалеем, Ваш аккаунт заблокирован. Пожалуйста, обратитесь в поддержку.',
		tooManyAuthTitle: 'Слишком много попыток.',
		tooManyAuth: 'Пожалуйста, повторите позже.',
		testWriteOff: 'Не удалось произвести тестовое списание с карты. Пожалуйста, обратитесь в поддержку.',
	},
	dates: DatesRU,
}
