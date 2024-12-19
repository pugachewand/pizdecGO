import { AddCheckItemStatusEntity, DeleteCheckItemStatusEntity, ICheckItemRequisitesEntity } from '../../../BackendEntities/Cart/ProductEntity';
import { HttpError } from '../../../Infrastructure/Exceptions/Errors';

import {
	CheckItemRequestEntity,
	PurchaseCancellationStatusEntity
} from '../../../BackendEntities/Cart/PurchaseRepoEntity';
import { PurchaseRepo } from '../../../Logic/RestApi/Purchase/PurchaseRepo';
import { globalContext } from '../../../DependencyInjection/AppContext';
import ModalController from '../../../Components/_Common/Modal/CustomAlertModalController';
import { FailureDebugCause, FailureSeverity } from '../../../Core/connections/MqttClient/IMqttClient';
import {
	generateFailureInfoParams,
	generateFailureDebugInfo,
	sendFailureInfoToRabbitMqAsync
} from '../../../Core/connections/MqttClient/MqttClientMessageRouting';

export const getAmountOfItems = (items: ICheckItemRequisitesEntity[], label: string) => {
	return items.filter(item => item.goodName === label).length
}

export const addCheckItemEitherAsync = async (props: CheckItemRequestEntity) => {
	const purchaseRepo = new PurchaseRepo()
	const { addErrorTitle } = globalContext.preferences.value.i18n.newPurchase.value.multiplePurchase
	const { common } = globalContext.preferences.value.i18n
	const responseEither = await purchaseRepo.addCheckItem({
		posId: props.posId,
		label: props.label.replace("\n",""),
		posOperationId: props.posOperationId,
	})

	if (responseEither.value.isLeft()) {
			ModalController.hideModal()
			ModalController.showModal({
				title: addErrorTitle,
				description: common.value.errors.pleaseTryAgain,
			})
		  const debugInfo = generateFailureDebugInfo(1, '', 'Error add basket item::', props.posOperationId)
		  const failureInfoParams = generateFailureInfoParams(debugInfo,  FailureSeverity.Lowest, FailureDebugCause.BASKET_ITEM_ADD)
		  sendFailureInfoToRabbitMqAsync(failureInfoParams)
		  return
	}
	const { status } = responseEither.value.unsafeCoerce()

	if (status !== AddCheckItemStatusEntity.Success) {
		console.log(status)
		reportAboutAddCheckError(status as AddCheckItemStatusEntity)
	}
	return responseEither.value.unsafeCoerce()
}

export const getTotalSum = (products: ICheckItemRequisitesEntity[]) => {
	if (products && products.length > 0) {
		return products.reduce((sum, val) => sum + (val.price) - (val.discountAmount), 0)
	}
	else {
		return 0
	}
}
export const getTotalDiscount = (products: ICheckItemRequisitesEntity[]) => {
	if (products && products.length > 0) {
		return products.reduce((sum, val) => sum + (val.discountAmount), 0)
	}
	else {
		return 0
	}
}

export const getLastItemFromArrayByBCLabel = (items: ICheckItemRequisitesEntity[], labelForBackEnd: string) => {
    const arr = items.filter(obj => obj.labelForBackend === labelForBackEnd)
    return arr[arr.length-1]
  }

export const deleteCheckItemEitherAsync = async (
	itemLabel: string,
	_items: ICheckItemRequisitesEntity[],
	posId: number,
	posOperationId: number
	) => {
	const label = itemLabel
	const purchaseRepo = new PurchaseRepo()
	const responseEither = await purchaseRepo.deleteCheckItem({
		posId,
		label,
		posOperationId,
	})
	if (responseEither.value.isRight()) {
		return responseEither.value.unsafeCoerce()
	}
	if (responseEither.value.isLeft()) {
		if (responseEither.value.swap().unsafeCoerce() instanceof HttpError) {
			const debugInfo = generateFailureDebugInfo(1, '', 'Error remove basket item::', posOperationId)
			const failureInfoParams = generateFailureInfoParams(debugInfo,  FailureSeverity.Lowest, FailureDebugCause.BASKET_ITEM_REMOVE)
			sendFailureInfoToRabbitMqAsync(failureInfoParams)
		}
		return responseEither.value.unsafeCoerce
	}
	const { status } = responseEither.value.unsafeCoerce()
	if (status !== 0) {
		reportAboutDeleteCheckError(status as DeleteCheckItemStatusEntity)
	}
	return responseEither.value.unsafeCoerce()
}

const getAllLabelsByBCLabel = (items: ICheckItemRequisitesEntity[],label: string) => {
    return items.filter(obj => obj.labelForBackend ? obj.labelForBackend === label : obj.label === label).map(item => item.label.toString())
}

export const deleteCheckItemsEitherAsync = async (
	backendLabel: string,
	items: ICheckItemRequisitesEntity[],
	posId: number,
	posOperationId: number
	) => {
	// const requestDate =  new Date()
	const label = getAllLabelsByBCLabel(items, backendLabel)
	let isSuccess
	const purchaseRepo = new PurchaseRepo()
	while (typeof label != "undefined"
	&& label != null
	&& label.length != null
	&& label.length > 0) {
		for (var i in label) {
			const responseEither = await purchaseRepo.deleteCheckItem({
				posId,
				label: label[i],
				posOperationId,
			})
			if (responseEither.value.isRight()) {
				const index = label.indexOf(label[i]);
				if (index > -1) { // only splice array when item is found
					label.splice(index, 1); // 2nd parameter means remove one item only
				}
				isSuccess = true

			} else {
				isSuccess = false
			}
		}
	}
	return isSuccess
}

function areObjectsEqual(itemFirst: ICheckItemRequisitesEntity, itemSecond: ICheckItemRequisitesEntity): boolean {
	const keys = Object.keys(itemFirst);
	return keys.length === Object.keys(itemSecond).length &&
		keys.every(key => itemSecond.hasOwnProperty(key) && itemFirst[key] === itemSecond[key]);
}

export const arraysHaveSameObjects = (itemsFirst: ICheckItemRequisitesEntity[], itemsSecond: ICheckItemRequisitesEntity[]): boolean => {
	return itemsFirst.every(item => itemsSecond.some(otherItem => areObjectsEqual(item, otherItem))) &&
		itemsSecond.every(item => itemsFirst.some(otherItem => areObjectsEqual(item, otherItem)));
}
export const reportAboutAddCheckError = (status: AddCheckItemStatusEntity) => {
	const { addErrorTitle } = globalContext.preferences.value.i18n.newPurchase.value.multiplePurchase
	ModalController.showModal({
		title: addErrorTitle,
		description: mapAddCheckResponseToMessage(status),
		subDescription: 'Попробуйте отсканировать другой товар'
	})
}

const reportAboutDeleteCheckError = (status: DeleteCheckItemStatusEntity) => {
	const { deleteErrorTitle } = globalContext.preferences.value.i18n.newPurchase.value.multiplePurchase
		ModalController.showModal({
			title: deleteErrorTitle,
			description: mapDeleteCheckResponseToMessage(status as DeleteCheckItemStatusEntity),
		})
}

export const mapAddCheckResponseToMessage = (status: AddCheckItemStatusEntity) => {
	const i18n = globalContext.preferences.value.i18n.newPurchase.value.multiplePurchase
	switch (status) {
		case AddCheckItemStatusEntity.Success: return i18n.success
		case AddCheckItemStatusEntity.ItemDoesNotBelongToPos: return i18n.itemDoesNotBelongToPos
		case AddCheckItemStatusEntity.ItemUsedInAnotherPosOperation: return i18n.itemUsedInAnotherPosOperation
		case AddCheckItemStatusEntity.ItemIsOverdue: return i18n.itemIsOverdue
		case AddCheckItemStatusEntity.PosOperationDoesNotFound: return i18n.posOperationIsNotFound
		case AddCheckItemStatusEntity.ItemDoesNotFound: return i18n.itemIsNotFound
		case AddCheckItemStatusEntity.CanNotAddCheckItem: return i18n.canNotAddCheckItem
		case AddCheckItemStatusEntity.UnexpectedError: return i18n.unexpectedError
		case AddCheckItemStatusEntity.PosOperationHasAlreadyPaid: return i18n.posOperationHasAlreadyPaid
		case AddCheckItemStatusEntity.ItemHasBeenAlreadyAdded: return i18n.itemHasBeenAlreadyAdded
		case AddCheckItemStatusEntity.UnrecognizedQrCode: return i18n.qrCodeDoesNotBelongToProduct
		case AddCheckItemStatusEntity.ScanPosInPurchase: return i18n.tryToBeginNewPurchase
		case AddCheckItemStatusEntity.PosOperationMustBeOpened: return i18n.posOperationMustBeOpened
		case AddCheckItemStatusEntity.PosOperationIsLockedAnotherRequest: return i18n.posOperationIsLockedAnotherRequest
	}
}
const mapDeleteCheckResponseToMessage = (status: DeleteCheckItemStatusEntity) => {
	const i18n = globalContext.preferences.value.i18n.newPurchase.value.multiplePurchase
	switch (status) {
		case DeleteCheckItemStatusEntity.Success: return i18n.success
		case DeleteCheckItemStatusEntity.ItemDoesNotFound: return i18n.itemIsNotFound
		case DeleteCheckItemStatusEntity.PosOperationDoesNotFound: return i18n.posOperationIsNotFound
		case DeleteCheckItemStatusEntity.PosOperationIsPaid: return i18n.posOperationIsPaid
		case DeleteCheckItemStatusEntity.ItemHasAlreadyDeleted: return i18n.itemHasAlreadyDeleted
		case DeleteCheckItemStatusEntity.UnexpectedError: return i18n.unexpectedError
		case DeleteCheckItemStatusEntity.UnrecognizedQrCode: return i18n.qrCodeDoesNotBelongToProduct
		case DeleteCheckItemStatusEntity.PosOperationMustBeOpened: return i18n.posOperationMustBeOpened
		case DeleteCheckItemStatusEntity.PosOperationIsLockedAnotherRequest: return i18n.posOperationIsLockedAnotherRequest
	}
}
export const mapCancellationResultStatusToMessage = (status: PurchaseCancellationStatusEntity) => {
	const i18n = globalContext.preferences.value.i18n.newPurchase.value.multiplePurchase
	switch (status) {
		case PurchaseCancellationStatusEntity.Success: return i18n.success
		case PurchaseCancellationStatusEntity.OperationForUserDoesNotFound: return i18n.cancelOperationForUserIsNotFound
		case PurchaseCancellationStatusEntity.OperationIsNotQrPurchase: return i18n.cancelOperationIsNotQrPurchase
		case PurchaseCancellationStatusEntity.PurchaseHasWrongStatus: return i18n.cancelPurchaseHasWrongStatus
		case PurchaseCancellationStatusEntity.PurchaseAlreadyCancelled: return i18n.purchaseAlreadyCancelled
		case PurchaseCancellationStatusEntity.UnexpectedError: return i18n.unexpectedError
		case PurchaseCancellationStatusEntity.PurchaseHasAlreadyPaid: return i18n.success
		case PurchaseCancellationStatusEntity.PosOperationIsLockedAnotherRequest: return i18n.posOperationIsLockedAnotherRequest
	}
}
