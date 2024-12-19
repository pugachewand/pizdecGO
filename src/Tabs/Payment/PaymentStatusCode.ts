import { globalContext } from "../../DependencyInjection/AppContext"
import { PaymentOperationStatusCode, PrimiKartuStatusCode } from "./PaymentEnum"

export const mapPaymentOperationStatusCode = (statusReason: number) => {
  const i18n = globalContext.preferences.value.i18n.payment.value.paymentError
  switch (statusReason) {
    case PaymentOperationStatusCode.Success: return i18n.success
    case PaymentOperationStatusCode.Failed: return i18n.failed
    case PaymentOperationStatusCode.NoLinkingPoint: return i18n.noLinkingPoint
    case PaymentOperationStatusCode.InvalidPaymentData: return i18n.invalidPaymentData
    case PaymentOperationStatusCode.NoPaymentService: return i18n.noPaymentService
    case PaymentOperationStatusCode.InternalError: return i18n.internalError
    case PaymentOperationStatusCode.IntegrationError: return i18n.integrationError
    case PaymentOperationStatusCode.TransportError: return i18n.transportError
    case PaymentOperationStatusCode.ReferToCardIssuer: return i18n.referToCardIssuer
    case PaymentOperationStatusCode.InvalidMerchant: return i18n.invalidMerchant
    case PaymentOperationStatusCode.PickUpCard: return i18n.pickUpCard
    case PaymentOperationStatusCode.DoNotHonor: return  i18n.doNotHonor
    case PaymentOperationStatusCode.Error: return i18n.error
    case PaymentOperationStatusCode.InvalidTransaction: return i18n.invalidTransaction
    case PaymentOperationStatusCode.AmountError: return i18n.amountError
    case PaymentOperationStatusCode.InvalidCardNumber: return i18n.invalidCardNumber
    case PaymentOperationStatusCode.NoSuchIssuer: return i18n.noSuchIssuer
    case PaymentOperationStatusCode.TransactionError: return i18n.transactionError
    case PaymentOperationStatusCode.FormatError: return i18n.formatError
    case PaymentOperationStatusCode.BankNotSupportedBySwitch: return i18n.bankNotSupportedBySwitch
    case PaymentOperationStatusCode.ExpiredCardPickup: return i18n.expiredCardPickup
    case PaymentOperationStatusCode.SuspectedFraud: return i18n.suspectedFraud
    case PaymentOperationStatusCode.RestrictedCard: return i18n.restrictedCard
    case PaymentOperationStatusCode.LostCard: return i18n.lostCard
    case PaymentOperationStatusCode.StolenCard: return i18n.stolenCard
    case PaymentOperationStatusCode.InsufficientFunds: return i18n.insufficientFunds
    case PaymentOperationStatusCode.ExpiredCard: return i18n.expiredCard
    case PaymentOperationStatusCode.TransactionNotPermitted: return i18n.transactionError
    case PaymentOperationStatusCode.SuspectedFraudDecline: return i18n.suspectedFraudDecline
    case PaymentOperationStatusCode.SecurityViolation: return i18n.securityViolation
    case PaymentOperationStatusCode.ExceedWithdrawFrequency: return i18n.exceedWithdrawFrequency
    case PaymentOperationStatusCode.Timeout: return i18n.timeout
    case PaymentOperationStatusCode.CannotReachNetwork: return i18n.cannotReachNetwork
    case PaymentOperationStatusCode.SystemError: return i18n.systemError
    case PaymentOperationStatusCode.UnableToProcess: return i18n.unableToProcess
    case PaymentOperationStatusCode.AuthenticationFailed: return i18n.authenticationFailed
    case PaymentOperationStatusCode.AuthenticationUnavailable: return i18n.authenticationUnavailable
    case PaymentOperationStatusCode.AuthenticationRequired: return i18n.AuthenticationRequired
    case PaymentOperationStatusCode.CardNotSupported: return i18n.CardNotSupported
    case PaymentOperationStatusCode.DuplicateTransaction: return i18n.DuplicateTransaction
    case PaymentOperationStatusCode.IncorrectPin: return i18n.IncorrectPin
    case PaymentOperationStatusCode.IncorrectPostalCode: return i18n.IncorrectPostalCode
    case PaymentOperationStatusCode.InvalidAccount: return i18n.InvalidAccount
    case PaymentOperationStatusCode.ExpirationDateInvalid: return i18n.ExpirationDateInvalid
    case PaymentOperationStatusCode.PinRequired: return i18n.PinRequired
    case PaymentOperationStatusCode.PinTryExceeded: return i18n.PinTryExceeded
    case PaymentOperationStatusCode.TestmodeDecline: return i18n.TestmodeDecline
    //ошибки с терминала
    case PaymentOperationStatusCode.POSTERMINAL_FAILED: return i18n.posTerminalFailed
    case PaymentOperationStatusCode.EMERGENCY_CANCEL: return i18n.emergencyCancel
    case PaymentOperationStatusCode.NO_CONNECTION: return i18n.noConnection
    case PaymentOperationStatusCode.OPERATION_ABORTED: return i18n.operationAborted
    case PaymentOperationStatusCode.DENIED: return i18n.denied
    default: return 'Прочая банковская ошибка'
  }
}

export const mapPrimiKartuOperationStatusCode = (statusCode: number) => {
  const i18n = globalContext.preferences.value.i18n.payment.value.primiKartuStatusCode

  switch(statusCode) {
    case PrimiKartuStatusCode.approved_0: return
    case PrimiKartuStatusCode.approved_1: return
    case PrimiKartuStatusCode.approved_2: return
    case PrimiKartuStatusCode.approved_3: return
    case PrimiKartuStatusCode.approved_4: return
    case PrimiKartuStatusCode.approved_5: return i18n.approved
    case PrimiKartuStatusCode.generalFailed: return i18n.generalFailed
    case PrimiKartuStatusCode.expiredCard_0: return i18n.expiredCard_0
    case PrimiKartuStatusCode.numberOfPinTriesExceede: return i18n.numberOfPinTriesExceede
    case PrimiKartuStatusCode.noSharingAllowed: return i18n.noSharingAllowed
    case PrimiKartuStatusCode.invalidTransaction: return i18n.invalidTransaction
    case PrimiKartuStatusCode.transactionNotSupported: return i18n.transactionNotSupported
    case PrimiKartuStatusCode.lostOrStoleCard: return i18n.lostOrStoleCard
    case PrimiKartuStatusCode.invalidCardStatus: return i18n.invalidCardStatus
    case PrimiKartuStatusCode.retrictedStatus: return i18n.retrictedStatus
    case PrimiKartuStatusCode.accountNotFound: return i18n.accountNotFound
    case PrimiKartuStatusCode.wrongCustomerInformation: return i18n.wrongCustomerInformation
    case PrimiKartuStatusCode.customerInfFormatError: return i18n.customerInfFormatError
    case PrimiKartuStatusCode.prepaidCodeNotFound: return i18n.prepaidCodeNotFound
    case PrimiKartuStatusCode.badTrackInformation: return i18n.badTrackInformation
    case PrimiKartuStatusCode.badMessageEdit: return i18n.badMessageEdit
    case PrimiKartuStatusCode.unableToAuth: return i18n.unableToAuth
    case PrimiKartuStatusCode.invalidCreditPan: return i18n.invalidCreditPan
    case PrimiKartuStatusCode.insufficientFunds: return i18n.insufficientFunds
    case PrimiKartuStatusCode.dublicateTransactionReceived: return i18n.dublicateTransactionReceived
    case PrimiKartuStatusCode.maxNumberOfTimesUsed: return i18n.maxNumberOfTimesUsed
    case PrimiKartuStatusCode.balanceNotAllowed: return i18n.balanceNotAllowed
    case PrimiKartuStatusCode.amountOverMax: return i18n.amountOverMax
    case PrimiKartuStatusCode.unableToProcess: return i18n.unableToProcess
    case PrimiKartuStatusCode.unableToAuthCallToIssuer: return i18n.unableToAuthCallToIssuer
    case PrimiKartuStatusCode.cardNotSupported: return i18n.cardNotSupported
    case PrimiKartuStatusCode.transactionDublicated: return i18n.transactionDublicated
    case PrimiKartuStatusCode.cardNotFound: return i18n.cardNotFound
    case PrimiKartuStatusCode.UIDNotFound: return i18n.UIDNotFound
    case PrimiKartuStatusCode.invalidAccount: return i18n.invalidAccount
    case PrimiKartuStatusCode.inCorretPin: return i18n.inCorretPin
    case PrimiKartuStatusCode.invalidAdvanceAmount: return i18n.invalidAdvanceAmount
    case PrimiKartuStatusCode.invalidTransactionCode: return i18n.invalidTransactionCode
    case PrimiKartuStatusCode.badCAVV: return i18n.badCAVV
    case PrimiKartuStatusCode.badCAVV2: return i18n.badCAVV2
    case PrimiKartuStatusCode.notFoundOriginalTransactionSlip: return i18n.notFoundOriginalTransactionSlip
    case PrimiKartuStatusCode.slipAlreadyReceived: return i18n.slipAlreadyReceived
    case PrimiKartuStatusCode.weakPin: return i18n.weakPin
    case PrimiKartuStatusCode.formatError: return i18n.formatError
    case PrimiKartuStatusCode.notFoundOriginalTransactionReverse: return i18n.notFoundOriginalTransactionReverse
    case PrimiKartuStatusCode.invalidCloseTransaction: return i18n.invalidCloseTransaction
    case PrimiKartuStatusCode.transactionTimeout: return i18n.transactionTimeout
    case PrimiKartuStatusCode.systemError: return i18n.systemError
    case PrimiKartuStatusCode.invalidTerminalIdentifier: return i18n.invalidTerminalIdentifier
    case PrimiKartuStatusCode.downloadReceived_0: return i18n.downloadReceived_0
    case PrimiKartuStatusCode.downloadReceived_1: return i18n.downloadReceived_1
    case PrimiKartuStatusCode.downloadAborted: return i18n.downloadAborted
    case PrimiKartuStatusCode.invalidCryptogram: return i18n.invalidCryptogram
    case PrimiKartuStatusCode.invalidMAC: return i18n.invalidMAC
    case PrimiKartuStatusCode.sequenceError: return i18n.sequenceError
    case PrimiKartuStatusCode.pinTriesLimitExceeded: return i18n.pinTriesLimitExceeded
    case PrimiKartuStatusCode.expiredCard_1: return i18n.expiredCard_1
    case PrimiKartuStatusCode.externalDecline: return i18n.externalDecline
    case PrimiKartuStatusCode.administrativeTrasaction: return i18n.administrativeTrasaction
    default: return 'DEFAULT TERMINAL ERROR'
  }
}
