import {
  DetailedSimpleCheckItemEntity,
  DoorPositionEntity,
  IPurchaseInitiationResponse,
  PosOperationStatusEntity,
  PosTypeEntity,
  SimpleCheckEntity,
  SimpleCheckItemEntity,
} from '../../BackendEntities/Cart/PurchaseRepoEntity'

import { PurchaseRepo } from '../../Logic/RestApi/Purchase/PurchaseRepo'
import { globalContext } from '../../DependencyInjection/AppContext';
import ModalController from '../../Components/_Common/Modal/CustomAlertModalController';
import { getPosSettingsAsync } from '../../Core/connections/MqttClient/MqttClientMessageRouting';

export const startPurchaseAsync = async (
  doorPosition: DoorPositionEntity,
) => {
  const purchaseRepo = new PurchaseRepo()
  const preferences = globalContext.preferences.value
  let isSuccess = false
  let qrCodeShowcase = ''

  if(preferences.posToken) {
    console.log('preferences.posToken on startPurchase:: ', preferences.posToken)
    const settings = await getPosSettingsAsync(preferences.posToken)
    console.log('pos settings -> posId ::', settings?.posId)
    qrCodeShowcase = settings?.qrCode || globalContext.preferences.value.qrCodeShowcase || ''
    console.log('qrCodeShowcase::', qrCodeShowcase)
    await globalContext.preferences.value.setQrCodeShowcase(qrCodeShowcase)
  }
  console.log('QRCODEin CONTEXT ', globalContext.preferences.value.qrCodeShowcase)
  if(!qrCodeShowcase || !preferences.terminalId) {
    isSuccess = false
    ModalController.showModal({
			title: 'Отсутствует соединение с точкой продаж',
			description: 'Перед началом покупки выберите точку продаж и терминал оплаты',
		})
    return isSuccess
  }
  const either = await purchaseRepo.initiatePurchase({
    qrCode: qrCodeShowcase ?? '',
    doorPosition: doorPosition,
  })
  if (either.value.isLeft()) {
    isSuccess = false
    ModalController.showModal({
			title: preferences.i18n.newPurchase.value.newPurchase.posUnavailable.title,
			description: preferences.i18n.newPurchase.value.newPurchase.posUnavailable.description,
		})
    return isSuccess
  }
  if (either.value.isRight()) {
    switch (either.value.unsafeCoerce().status) {
      case PosOperationStatusEntity.Success:
      case PosOperationStatusEntity.UserPurchaseIsBlocked:
      case PosOperationStatusEntity.MobileAppDisabled:
        isSuccess = true
        break
      case PosOperationStatusEntity.IncorrectQrCode:
      case PosOperationStatusEntity.InfrastructureFailure:
      case PosOperationStatusEntity.PurchaseNotAllowed:
      case PosOperationStatusEntity.LastPosOperationIncomplete:
      case PosOperationStatusEntity.NegativeBalance:
      case PosOperationStatusEntity.UserProfileNotFoundError:
      case PosOperationStatusEntity.WebPurchasesAreBlocked:
      case PosOperationStatusEntity.PaymentMethodsNotConfigured:
      case PosOperationStatusEntity.PaymentCardNotFound:
      case PosOperationStatusEntity.InvalidPaymentSystem:
        isSuccess = true
        break
      case PosOperationStatusEntity.PosIsAlreadyOpenedForPurchase:
      case PosOperationStatusEntity.PosIsOccupiedByVisitor:
        isSuccess = true
        break
    }
  }
  let parsedSettings
  let parsedData
  try {
    parsedSettings = JSON.parse(either.value.unsafeCoerce().settings)
    parsedData = {...either.value.unsafeCoerce(), settings: parsedSettings}
  }catch (e) {
    console.log('Error parse pos settings::', e)
  }
  if (parsedData && parsedData.status !== PosOperationStatusEntity.Success) {
    ModalController.showModal({
			title: globalContext.preferences.value.i18n.newPurchase.value.newPurchase.errorTitle,
			description: mapPurchaseResponseToMessage(parsedData.status),
		})
  }
  return parsedData
}

export const getUnpaidPurchaseAsync = async () => {
  const purchaseRepo = new PurchaseRepo()
  const either = await purchaseRepo.getFirstUnpaidCheck()
  if (either.value.isLeft()) {
    return null
  }
  const fetchResult = either.value.unsafeCoerce()
  if (fetchResult !== null && fetchResult?.status === PosOperationStatusEntity.Success) {
    return flatData(fetchResult)
  } else {
    return null
  }
}

export const flatData = (check: SimpleCheckEntity) => {
  const groupedItems = check.items.map((item: SimpleCheckItemEntity) =>
    item.detailedItems.map((detailedItem: DetailedSimpleCheckItemEntity) => ({
      posOperationId: check.id,
      goodName: item.goodInfo.goodName,
      price: detailedItem.price,
      discountAmount: detailedItem.discount,
      goodImagePath: item.goodInfo.goodImagePath,
      labeledGoodId: detailedItem.labeledGoodId,
      label: detailedItem.label,
      goodCalories: item.goodInfo.goodCalories,
      currency: check.currency,
    })),
  )
  const groupedCheck: IPurchaseInitiationResponse = {
    bonusPayPercent: check.originInfo.bonusPayPercent,
    brandAccountId: check.originInfo.brandAccountId,
    posId: check.originInfo.posId,
    posOperationId: check.id,
    posType: PosTypeEntity.QrCode,
    settings: JSON.parse(check.originInfo.settings),
    status: PosOperationStatusEntity.Success,
    usingFiscalization: check.usingFiscalization,
    paymentMethodTypes: check.paymentMethodTypes,
    posModel: check.originInfo.posModel,
    paymentSystem: check.originInfo.paymentSystem,
    countryIso: check.originInfo.countryIso,
  }
  return {...groupedCheck, items: groupedItems}
}


export const mapPurchaseResponseToMessage = (status: PosOperationStatusEntity | null) => {
  const { newPurchase, common } = globalContext.preferences.value.i18n
  const  newPurchasei18n  = newPurchase.value.newPurchase
  switch (status) {
    case PosOperationStatusEntity.Success: return 'success'
    case PosOperationStatusEntity.IncorrectQrCode: return newPurchasei18n.incorrectQrCode
    case PosOperationStatusEntity.NegativeBalance: return newPurchasei18n.negativeBalance
    case PosOperationStatusEntity.PosIsAlreadyOpenedForPurchase:
    case PosOperationStatusEntity.PosIsOccupiedByVisitor:
    case PosOperationStatusEntity.LastPosOperationIncomplete: return newPurchasei18n.lastPosOperationIncomplete
    case PosOperationStatusEntity.PurchaseNotAllowed: return newPurchasei18n.purchaseNotAllowed
    case PosOperationStatusEntity.UserProfileNotFoundError:
    case PosOperationStatusEntity.WebPurchasesAreBlocked:
    case PosOperationStatusEntity.PaymentMethodsNotConfigured:
    case PosOperationStatusEntity.InfrastructureFailure: return newPurchasei18n.purchaseInitiationFailed
    case PosOperationStatusEntity.UserPurchaseIsBlocked: return common.value.errors.userIsBlocked
    case PosOperationStatusEntity.PaymentCardNotFound: return common.value.errors.unknownErrorTitle
    case PosOperationStatusEntity.InvalidPaymentSystem: return newPurchasei18n.invalidPaymentSystem
    default: return newPurchasei18n.purchaseInitiationFailed
  }
}
