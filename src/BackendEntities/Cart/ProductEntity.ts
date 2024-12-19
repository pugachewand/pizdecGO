export type IAddOrDeleteCheckItemResponseEntity = {
	status: AddCheckItemStatusEntity | DeleteCheckItemStatusEntity
	error: string
	checkItemRequisites: ICheckItemRequisitesEntity
}

export enum AddCheckItemStatusEntity {
	Success = 0,
	ItemDoesNotBelongToPos = 1,
	ItemUsedInAnotherPosOperation = 2,
	ItemIsOverdue = 3,
	PosOperationDoesNotFound = 4,
	ItemDoesNotFound = 5,
	CanNotAddCheckItem = 6,
	UnexpectedError = 7,
	PosOperationHasAlreadyPaid = 8,
	ItemHasBeenAlreadyAdded = 9,
	UnrecognizedQrCode = 10,
	ScanPosInPurchase = 11,
	PosOperationMustBeOpened = 12,
	PosOperationIsLockedAnotherRequest = 13
}
export enum DeleteCheckItemStatusEntity {
	Success = 0,
	ItemDoesNotFound = 1,
	PosOperationDoesNotFound = 2,
	PosOperationIsPaid = 3,
	ItemHasAlreadyDeleted = 4,
	UnexpectedError = 5,
	UnrecognizedQrCode = 6,
	PosOperationMustBeOpened = 7,
	PosOperationIsLockedAnotherRequest = 8
}


export interface ICheckItemRequisitesEntity {
	[key: string]: unknown;
	labelForBackend?: string,
    labeledGoodId: number
    posOperationId: number
    goodName: string
	// TODO: Проверить передачу float знгачений
    price: number
    discountAmount: number
    goodImagePath: string
    label: string
    currency: string
    goodCalories: number,
    bonusCheckItems?: BonusCheckItem[]
}

export type BonusCheckItem = {
    bonusPromotionId: number
    labeledGoods: number[]
    bonusAmount: number
}

export type SimpleCheckGoodInfoEntity = {
	goodId: number
	goodName: string
	goodDescription: string
	goodImagePath: string
	goodCalories: number
}
