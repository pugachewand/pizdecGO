import { InfoI18n } from './Info.i18n'

export const infoENG: InfoI18n = {
	registrationSuccess: {
		congratulationsYouRegistered: 'Congratulations! Your registration is complete!',
		bringCameraToQRCode: 'To start purchases please focus your camera on the QR-code of the micro-market',
	},
	bankingCardAdditionSuccess: {
		newCardAttached: 'A new card has been added',
		newCardAttachedAndConfirmed: 'A new card has been added and confirmed, all payments will be debited from this card.',
	},
	purchase: {
		youHaventBoughtAnythingYet: 'You haven\'t bought anything yet',
		takeFirstStep: 'It\'s time to take the first step',
		step1OpenPos: '1. Open the micro-market',
		step2ChooseWhatYouWant: '2. Choose what you want',
		step3Pay: '3. Pay',
		openDoorButton: 'Open the door',
	},
	purchaseSuccess: {
		thanksForPurchase: 'Thanks for your purchase',
		awaitForReceipt: 'Wait for a cheque',
		selfShop: 'You can leave the store',
		historyReceipt: 'You can find cheque in "History"',
		quit: 'Complete',
	},
	inAppUpdates: {
		isUnstabilityVersion: 'This version of the application may be unstable.\nWe are working on releasing a new version and will soon offer to switch to it.\nIf errors occur, contact technical support (menu "Communication").',
		ios: {
			title: 'Update available',
			message: 'Would you like to upgrade now?',
			immediateMessage: 'The application cannot continue without an update.',
			buttonUpgradeText: 'Update',
        	buttonCancelText: 'Cancel',
		},
	},
	installApp: {
		firstUncoercedTitle: 'You are using an older version of the izipoint app.',
		secondUncoercedTitle: 'The application will be supported until ',
		thirdUncoercedTitle: 'Download the new improved app izipoint lite.',
		firstForcedTitle: 'This version of izipoint is outdated.',
		secondForcedTitle: 'Click "Download" below to download the improved izipoint lite app.',
		continueToPWA: 'Continue in browser',
		download: 'Download new version',
		listTitle: 'In the new application we have added:',
		firstOpportunity: 'authorization through Gmail and Apple ID',
		secondOpportunity: 'payment methods YandexPay and SBP',
		thirdOpportunity: 'new user interaction algorithms',
	},
	support: {
		hotlineSupportDescription: 'Our support is always online: ',
	},
	terminalConnection: {
		connectionWithBankTitle: 'Checking the connection...',
		connectionWithBankDescription: 'Please wait. The connection of the POS terminal\n with the bank is being checked'
	}
}
