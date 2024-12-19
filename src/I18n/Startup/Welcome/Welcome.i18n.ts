import { AppEnvironment } from '../../../Infrastructure/Auth/BackendMode'

export type WelcomeI18n = {
	texts: {
		hello: string
		welcome: (appName: string) => string
		registration: string
		iAgreeWith: string
		userAgreement: string
	}
	buttons: {
		startRegistration: string
	}
	mode: {
		selectBackendMode: string
		customBackendAddress: string
		qrCodeShowCase: string
		paymentReconciliationDate: string
		paymentReconciliationFrequency: string
		terminalId: string
		posToken: string
		name: (mode: AppEnvironment) => string
	}
}
