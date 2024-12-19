import { DoorPositionEntity } from '../../../BackendEntities/Cart/PurchaseRepoEntity';

export type NewPurchaseI18n = {
	title: string
	newPurchase: {
		errorTitle: string
		incorrectQrCode: string
		lastPosOperationIncomplete: string
		purchaseNotAllowed: string
		negativeBalance: string
		purchaseInitiationFailed: string
		doorToTitle: (door: DoorPositionEntity) => string
		scanQRCodeToOpenPosPartI: string
		scanQRCodeToOpenPosPartII: string
		unauthorizedCameraText: string
		noPromotionTitle: string
		noPromotionBody: string
		invalidPaymentSystem: string
		openingDoor: {
			title: string
			description: string
			time: (seconds: number) => string
		}
		posUnavailable: {
			title: string
			description: string
			supportButton: string
			closeButton: string
		}
		posIsOccupiedByVisitor: {
			title: string
			description: string
		}
		scan: string
		or: string
	}
	multiplePurchase: {
		title: string
		pay: string
		openDoor: string
		openAnotherDoor: string
		scanQRText: string
		availableBonuses: string
		totalSum: string
		payBonuses: string
		getBonuses: string
		payMoney: string
		deleteMsgTitle: string
		itemIsNotFound: string
		barcodeIsNotFound: string
		itemIsNotFoundDesc: (isQR: boolean) => string
		scanQrorBarcode: string
		posOperationIsNotFound: string
		posOperationIsPaid: string
		itemHasAlreadyDeleted: string
		unexpectedError: string
		itemDoesNotBelongToPos: string
		itemUsedInAnotherPosOperation: string
		itemIsOverdue: string
		canNotAddCheckItem: string
		posOperationHasAlreadyPaid: string
		itemHasBeenAlreadyAdded: string
		qrCodeDoesNotBelongToProduct: string
		barCodeDoesNotBelongToProduct: string
		posOperationIsLockedAnotherRequest: string
		posOperationMustBeOpened: string
		addErrorTitle: string
		deleteErrorTitle: string
		payErrorTitle: string
		payWithAnotherCardButton: string
		canRetryPayWithin: string
		tryToPay: string
		loadingText: string
		success: string
		cancelOperationForUserIsNotFound: string
		cancelOperationIsNotQrPurchase: string
		cancelPurchaseHasWrongStatus: string
		purchaseAlreadyCancelled: string
		pleaseWaitForNextAvailablePayTime: string
		cancelPurchase: string
		cancelEmptyPurchase: string
		tryToBeginNewPurchase: string
		itemInPromoaction: string
		bonuses: string
		calories: string
		buttons: {
			cancel: string
			continue: string
		}
		customAdd: {
			title: string
			addButton: string
			openCustomAdd: string
		}
	}
	unpaidCheck: {
		prayingSmile: string
		payMessage: string
		openCheckButton: string
		title: string
	}
	threeDS: {
		title: string
	}
}
