import { AuthI18n, AuthScenarioI18n } from './Auth.i18n'

const RegistrationAuthScenarioRU: AuthScenarioI18n = {
	title: 'Authorization',
	buttons: {
		login: 'Log In',
		sendSMS: 'Get authorization code',
		reSendCode: 'Resend Verification Code',
		restoreAccount: 'Restore account',
		cancel: 'Cancel',
	},
	account: {
		text: 'Account is in the process of being deleted and will be permanently deleted',
	},
	inputs: {
		codeSentToNumber: 'A verification code has been sent to the number',
		enterCodeFromSMS: 'Enter the verification code below',
		enterPhoneNumber: 'Enter your phone number',
		bottomText: 'By tapping "Get authorization code" you agree to the terms of',
		userAgreement: 'user agreement ',
		countryPickerPlaceholder: 'Search',
		phoneInputPlaceholder: 'Phone Number',
	},
	errors: {
		sendSmsError: 'Error sending SMS to number',
		correctPhone: 'You have entered an invalid phone number',
		emptyCode: 'Enter confirmation code',
		userAlreadyExist: 'A user with this number already exists',
		verificationCodeInvalid: 'Verification code is incorrect',
		unexpectedAuthError: 'Authentication error',
	},
	goBackConfirmation: {
		title: 'Are you sure you want to stop verifying your phone number?',
		yes: 'Yes',
		no: 'No',
	},
	captions: {
		phoneNumberIsSame: 'The entered number is already in use by you',
		ableToResendSmsCodeWithin: val => `You can request the code again in ${val}`,
		attention: 'Attention!',
		banAlert: 'Too many attempts!\nPlease try logging in after 24 hours.',
		contactSupport: 'If you didn\'t receive code - please contact support.',
		lastAttemptToSendSMS: 'If you didn\'t receive code - please contact support, make sure code didn\'t get into spam.',
		banToSendSMS: 'You can\'t request the code again. For authorization contact support.',
	},
	operations: {
		getTerminalConnectionStatus: 'Checking connection status with POS terminal'
	}
}

export const AuthENG: AuthI18n = {
	registration: RegistrationAuthScenarioRU,
	changePhoneNumber: {
		...RegistrationAuthScenarioRU,
		title: 'Change phone number',
		buttons: {
			...RegistrationAuthScenarioRU.buttons,
			login: 'Change number',
		},
		inputs: {
			...RegistrationAuthScenarioRU.inputs,
			enterPhoneNumber: 'Enter your phone number',
			bottomText: '',
		},
	},
}
