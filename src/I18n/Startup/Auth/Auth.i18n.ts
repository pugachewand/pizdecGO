export type AuthScenarioI18n = {
	title: string
	buttons: {
		login: string
		sendSMS: string
		reSendCode: string
		restoreAccount: string
		cancel: string
	}
	account: {
		text: string
	}
	inputs: {
		codeSentToNumber: string
		enterPhoneNumber: string
		enterCodeFromSMS: string
		bottomText: string
		userAgreement: string
		countryPickerPlaceholder: string
		phoneInputPlaceholder: string
	}
	errors: {
		sendSmsError: string
		correctPhone: string
		emptyCode: string
		userAlreadyExist: string
		verificationCodeInvalid: string
		unexpectedAuthError: string
	}
	goBackConfirmation: {
		title: string
		yes: string
		no: string
	}
	captions: {
		phoneNumberIsSame: string
		ableToResendSmsCodeWithin: (value: string) => string
		attention: string
		banAlert: string
		contactSupport: string
		lastAttemptToSendSMS: string
		banToSendSMS: string
	}
	operations: {
		getTerminalConnectionStatus: string
	}
}

export type AuthI18n = {
	registration: AuthScenarioI18n
	changePhoneNumber: AuthScenarioI18n
}

