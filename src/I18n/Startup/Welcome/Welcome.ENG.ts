import { WelcomeI18n } from './Welcome.i18n'

export const WelcomeENG: WelcomeI18n = {
	texts: {
		hello: 'Hello!',
		welcome: appName => `Welcome to the ${appName}!`,
		registration:
			'Soon you can buy whatever you want, but first, you need to register;) It\'s fast;)',
		iAgreeWith: 'I have read and agree with the Terms of Use.',
		userAgreement: 'the Terms of Use.',
	},
	buttons: {
		startRegistration: 'Start registration',
	},
	mode: {
		selectBackendMode: 'Select a mode (or close the menu if you happen to be here by accident)',
		customBackendAddress: 'Backend URL (for development)',
		qrCodeShowCase: 'Qr-код витрины',
		paymentReconciliationDate: 'Сверка итогов (в формате ЧЧ:ММ)',
		paymentReconciliationFrequency: 'Частота проведения сверки итогов в минутах',
		terminalId: 'ID Терминала',
		posToken: 'kit-pos token',
		name: mode => {
			switch (mode) {
				case 'beta':
					return 'Beta'
				case 'prod':
					return 'Prod'
				case 'development':
					return 'Development'
			}
		},
	},
}
