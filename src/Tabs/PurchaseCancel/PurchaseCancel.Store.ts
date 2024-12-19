import { PurchaseCancellationStatusEntity } from '../../BackendEntities/Cart/PurchaseRepoEntity';
import { PurchaseRepo } from '../../Logic/RestApi/Purchase/PurchaseRepo';
import { globalContext } from '../../DependencyInjection/AppContext';
import ModalController from '../../Components/_Common/Modal/CustomAlertModalController';
import { mapCancellationResultStatusToMessage } from '../Cart/ItemsTable/ItemsTable.Store';
import {
    generateFailureDebugInfo,
    generateFailureInfoParams,
    sendFailureInfoToRabbitMqAsync
} from '../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity } from '../../Core/connections/MqttClient/IMqttClient';

export const cancelPurchaseAsync = async (posOperationId: number) => {
    const purchaseRepo = new PurchaseRepo()
    const { value: cancelEither } = await purchaseRepo.cancelMultiplePurchaseCheck(posOperationId)
    if (cancelEither.isLeft()){
          ModalController.showModal({
			title: globalContext.preferences.value.i18n.common.value.errors.unknownErrorTitle,
			description: globalContext.preferences.value.i18n.newPurchase.value.newPurchase.posUnavailable.description,
		})
        const error = cancelEither.swap().unsafeCoerce()
        const debugInfo = generateFailureDebugInfo(1, '', 'Error cancel purchase:: ' + error, posOperationId)
        const failureInfoParams = generateFailureInfoParams(debugInfo,  FailureSeverity.Normal, FailureDebugCause.CANCEL_PURCHASE)
        sendFailureInfoToRabbitMqAsync(failureInfoParams)
        return false
    }
    const cancelResult = cancelEither.unsafeCoerce()
    if(cancelResult.status !== PurchaseCancellationStatusEntity.Success) {
        ModalController.showModal({
            title: globalContext.preferences.value.i18n.common.value.errors.unknownErrorTitle,
            description: mapCancellationResultStatusToMessage(cancelResult.status),
        })
    }
    const failureSeverity = cancelResult.status === PurchaseCancellationStatusEntity.Success ? FailureSeverity.Lowest : FailureSeverity.Normal
    const debugInfo = generateFailureDebugInfo(cancelResult.status, mapCancellationResultStatusToMessage(cancelResult.status), cancelResult?.error || '', posOperationId)
    const failureInfoParams = generateFailureInfoParams(debugInfo,  failureSeverity, FailureDebugCause.CANCEL_PURCHASE)
    sendFailureInfoToRabbitMqAsync(failureInfoParams)
    return cancelResult.status === PurchaseCancellationStatusEntity.Success
        || cancelResult.status === PurchaseCancellationStatusEntity.OperationForUserDoesNotFound
        || cancelResult.status === PurchaseCancellationStatusEntity.OperationIsNotQrPurchase
        || cancelResult.status === PurchaseCancellationStatusEntity.PurchaseAlreadyCancelled
        || cancelResult.status === PurchaseCancellationStatusEntity.PurchaseHasAlreadyPaid;
}
