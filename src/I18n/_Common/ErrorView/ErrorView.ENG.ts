import { ErrorViewI18n } from './ErrorView.i18n'

export const ErrorViewENG: ErrorViewI18n = {
	message: 'Sorry, something went wrong.\n We have already sent bug data to the authors of the program, try to refresh the page.',
	refresh: 'Update',
	noInternetConnection: 'The internet connection has been lost. Try to connect again, click the "Update" button',
	notReady: {
		errorTitle: 'Something went wrong',
		errorGetPosSettingsDescription: 'Please check the correctness of the settings \nand try again',
		description: 'We have notified the developers about it',
		additionalDescription: 'Please try opening the showcase again',
		windowClose: "The window will close in",
		connectionErrorTitle: 'Oops... We have a problem',
		ConnectionErrorSubtitlePart: '\nNo connection with ',
		connectionErrorSubtitlePartII: 'We already know about this error. Technical details:',
		terminalConnectionErrorTitle: "Error checking the connection with the POS terminal",
		terminalConnectionErrorDescription: "Please check your connection to the POS terminal and restart the application",
		scannerConnectionErrorTitle: 'Scanner not connected',
		scannerConnectionErrorDescription: 'Scanner not connected, please connect scanner and re-open app',
	}
}
