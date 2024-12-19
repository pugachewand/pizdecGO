import { WelcomeI18n } from './Welcome.i18n'

export const WelcomeRU: WelcomeI18n = {
	texts: {
		hello: 'Привет!',
		welcome: appName => `Добро пожаловать в ${appName}!`,
		registration:
			'Скоро Вы сможете купить все что захотите, но сначала нужно зарегистрироваться ;) Это быстро ;)',
		iAgreeWith: 'Я прочитал(а) и согласен(а) с условиями',
		userAgreement: 'пользовательского соглашения',
	},
	buttons: {
		startRegistration: 'Начать регистрацию',
	},
	mode: {
		selectBackendMode: 'Выберите режим (или закройте меню, если оказались здесь случайно)',
		customBackendAddress: 'Адрес бэкэнда (для разработки)',
		qrCodeShowCase: 'Qr-код витрины',
		paymentReconciliationDate: 'Сверка итогов (в формате ЧЧ:ММ)',
		paymentReconciliationFrequency: 'Частота проведения сверки итогов в минутах',
		terminalId: 'ID Терминала',
		posToken: 'Токен витрины',
		name: mode => {
			switch (mode) {
				case 'beta':
					return 'Бета'
				case 'prod':
					return 'Прод'
				case 'development':
					return 'Разработка'
			}
		},
	},
}
