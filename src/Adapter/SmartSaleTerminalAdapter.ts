import {
  RequestMakePayment,
  RequestMakeRefundAndCancelPayment,
  SmartSaleTerminal,
  SmartSaleTerminalGetConnectionStatusCommand,
  SmartSaleTerminalMakePaymentCommand
} from '../NativeModules/Android/SmartSaleTerminal/SmartSaleTerminal'
import { EitherAsync } from 'purify-ts/esm'
import { action, makeObservable, observable } from 'mobx';
import { PosTerminalOperationStatusEnum } from '../Tabs/Payment/PaymentEnum';
import dayjs from 'dayjs';
import Config from 'react-native-config';
import { globalContext } from '../DependencyInjection/AppContext';
import ModalController from '../Components/_Common/Modal/CustomAlertModalController';
import { AppIoCContainer } from '../Infrastructure/Objects/AppIoContainer';
import { HealthDegradedCallbackType } from '../Core/AppHealthProvider/IAppHealthProvider';
import { FailureDebugCause, FailureSeverity } from '../Core/connections/MqttClient/IMqttClient';
import {
  generateFailureDebugInfo,
  generateFailureInfoParams,
  sendFailureInfoToRabbitMqAsync
} from '../Core/connections/MqttClient/MqttClientMessageRouting';
import { shouldPerformCheck } from '../Core/AppHealthProvider/shouldPerformCheck';
import { ApplicationHealthProviderItemName } from '../Infrastructure/Objects/ObjectAvailabilityVerifiers/types';

export class PaymentServiceAdapter {
  appHealthProvider = AppIoCContainer.getAppHealthProvider()
  posTerminalLinkWithBankErrorProvider = AppIoCContainer.getPosTerminalLinkWithBankErrorProvider()
  isChecking: boolean = false
  i18n = globalContext.preferences.value.i18n

  constructor() {
    makeObservable({
      isChecking: observable,
      setIsChecking: action,
    })
  }
  setIsChecking = (status: boolean) => {
    this.isChecking = status
  }
  private readonly makePaymentRequest = (amount: string, currency: string): RequestMakePayment => ({
    amount,
    currencyCode: currency,
	})

  private readonly cancelOrRefundRequest = (amount: string, currency: string, authorizeCode: string, linkNumberRrn: string): RequestMakeRefundAndCancelPayment => ({
    amount,
    currencyCode: currency,
    authorizeCode,
    linkNumberRrn,
})

  public readonly getConnectionStatus = async () => {
    return JSON.parse((await EitherAsync(() => SmartSaleTerminal.getConnectionStatus()).mapLeft(_ => new Error()).run()).extract().toString())
  }
  isTimeNextCheckLinkWithBank = () => {
    if(!this.appHealthProvider.lastCheckedLinkWithBankTime) {
      return true
    }
    const currentTime = dayjs()
    const checkTime = !this.appHealthProvider.isPosTerminalLinkWithBankEstablished ? Number(Config.PERIOD_FOR_CHECK_LINK_WITH_BANK_RESTORE) : Number(Config.PERIOD_FOR_CHECK_LINK_WITH_BANK_STATUS)
    const difference = currentTime.diff(this.appHealthProvider.lastCheckedLinkWithBankTime, 'minute')
    return difference >= checkTime
  }

  checkConnectionPeriodic = () => {
    const needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isPosTerminalLinkWithBankEstablished)
    if (!this.isTimeNextCheckLinkWithBank() || this.isChecking) {
      return this.appHealthProvider.isPosTerminalLinkWithBankEstablished
    }
    if(!this.appHealthProvider.isPosTerminalAvailable) {
      if(this.appHealthProvider.isPosTerminalLinkWithBankEstablished) {
        const debugInfo = generateFailureDebugInfo(1, PosTerminalOperationStatusEnum.NO_CONNECTION)
        const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.STATUS_TERMINAL_LINK_WITH_BANK)
        sendFailureInfoToRabbitMqAsync(failureInfoParams)
      }
      this.posTerminalLinkWithBankErrorProvider.cleanConnectionErrorCount()
      if (needCheck) {
        this.appHealthProvider.setPosTerminalLinkWithBankEstablished(false)
      }
      return false
    }
    if(!needCheck) {
      this.posTerminalLinkWithBankErrorProvider.cleanConnectionErrorCount()
      this.appHealthProvider.setPosTerminalLinkWithBankEstablished(true)
      return true
    }
    const subscribers: HealthDegradedCallbackType[] = this.appHealthProvider.subscribers
    let hasTerminalConnectionWithBank:boolean = this.appHealthProvider.isPosTerminalLinkWithBankEstablished
    try {
      if(subscribers.length > 0) {
        this.appHealthProvider.unsubscribe(subscribers[0])
      }
      ModalController.showModal({
        title: this.i18n.info.value.terminalConnection.connectionWithBankTitle,
        description: this.i18n.info.value.terminalConnection.connectionWithBankDescription,
        isConnectionError: true,
      })
      this.setIsChecking(true)

      this.getConnectionStatus().then(async (result:SmartSaleTerminalGetConnectionStatusCommand) => {
        console.log('TerminalConnectionWithBankResult==================', result)
        ModalController.hideModal()
        hasTerminalConnectionWithBank = result.response?.posTerminalOperationStatus === PosTerminalOperationStatusEnum.APPROVED && result.errorCode === null
        if(this.appHealthProvider.isPosTerminalLinkWithBankEstablished !== hasTerminalConnectionWithBank) {
          const failureSeverity = result.response?.posTerminalOperationStatus === PosTerminalOperationStatusEnum.APPROVED ? FailureSeverity.Lowest : FailureSeverity.Normal
          const debugInfo = generateFailureDebugInfo(result.response?.operationId || 1, result.response?.posTerminalOperationStatus || '', result.errorCode || '')
          const failureInfoParams = generateFailureInfoParams(debugInfo, failureSeverity, FailureDebugCause.STATUS_TERMINAL_LINK_WITH_BANK)
          sendFailureInfoToRabbitMqAsync(failureInfoParams)
        }

        if(!hasTerminalConnectionWithBank) {
          this.posTerminalLinkWithBankErrorProvider.incrementConnectionErrorCount()
        }

        this.appHealthProvider.setPosTerminalLinkWithBankEstablished(hasTerminalConnectionWithBank)
        console.log('isPosTerminalLinkWithBankEstablished', this.appHealthProvider.isPosTerminalLinkWithBankEstablished)
        if(subscribers.length > 0) {
          this.appHealthProvider.subscribe(subscribers[0])
        }
        this.appHealthProvider.notify()
      })

    }catch (e) {
      hasTerminalConnectionWithBank = false
      console.log('Error get connection terminal with bank:::', e)
      const debugInfo = generateFailureDebugInfo(1, '', 'Error get connection terminal with bank::: ' + e)
      const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.STATUS_TERMINAL_LINK_WITH_BANK)
      sendFailureInfoToRabbitMqAsync(failureInfoParams)
    }finally {
      this.appHealthProvider.setLastCheckedLinkWithBankTime(dayjs().toDate())
      console.log('lastCheckedLinkWithBankTime', this.appHealthProvider.lastCheckedLinkWithBankTime)
      this.appHealthProvider.setPosTerminalLinkWithBankEstablished(hasTerminalConnectionWithBank)
      this.setIsChecking(false)
      this.appHealthProvider.notify()
    }
    return hasTerminalConnectionWithBank
  }

  public readonly makePayment = async (amount: string, currencyCode: string, posOperationId: number) => {
    const request = this.makePaymentRequest(amount, currencyCode)
    const readyEither = await EitherAsync(() => SmartSaleTerminal.makePayment(request)).mapLeft(_ => Error()).run()
    const extract = readyEither.extract()

    const debugInfo = generateFailureDebugInfo(0, `Result of makePaymentRequest${extract.toString()}`, '', posOperationId)
    const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Critical, FailureDebugCause.PAYMENT_PURCHASE)
    sendFailureInfoToRabbitMqAsync(failureInfoParams)

    if (extract === null || extract === undefined) {
      console.log('No data to parse from makePaymentRequest', extract)
      return null
    }

    let jsonParse:SmartSaleTerminalMakePaymentCommand
    try {
      jsonParse = JSON.parse(extract.toString())
      console.log('makePaymentRequest:::', jsonParse)

      const debugInfo = generateFailureDebugInfo(Number(jsonParse.succeeded), `Result parse of makePaymentRequest::${jsonParse.response?.posTerminalOperationStatus}`, '', posOperationId)
      const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Critical, FailureDebugCause.PAYMENT_PURCHASE)
      sendFailureInfoToRabbitMqAsync(failureInfoParams)

      return jsonParse
    }catch (e) {
      console.log('Error makePaymentRequest:::' , e)
      const debugInfo = generateFailureDebugInfo(1, ``, 'Error makePaymentRequest::: ' + e, posOperationId)
      const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Critical, FailureDebugCause.PAYMENT_PURCHASE)

      sendFailureInfoToRabbitMqAsync(failureInfoParams)
      return null
    }
  }

  public readonly reconciliateOfTotals = async () => {
    return JSON.parse((await EitherAsync(() => SmartSaleTerminal.reconciliateOfTotals()).mapLeft(_ => new Error()).run()).extract().toString())
  }

  public readonly createReconciliateOfTotals = async (timeOfStart: string, periodInMinutes: number, lastTimeOfRun: string | null, repeatOnErrorCount: number) => {
    await EitherAsync(() => SmartSaleTerminal.createReconciliateOfTotals({timeOfStart, periodInMinutes, lastTimeOfRun, repeatOnErrorCount}))
  }
  public readonly initializeReconciliateOfTotals = async () => {
    await EitherAsync(() => SmartSaleTerminal.initializeReconciliateOfTotals()).mapLeft(_ => new Error()).run()
  }
  public readonly beginReconciliateOfTotals = async (isReady: boolean) => {
    await EitherAsync(() => SmartSaleTerminal.beginReconciliateOfTotals({isReady})).mapLeft(_ => new Error()).run()
  }

  public readonly makeRefund = async (amount: string, currencyCode: string, authorizeCode: string, linkNumberRrn: string) => {
    const request = this.cancelOrRefundRequest(amount, currencyCode, authorizeCode, linkNumberRrn)
    return JSON.parse((await EitherAsync(() => SmartSaleTerminal.makeRefund(request)).mapLeft(_ => new Error()).run()).extract().toString())
  }

  public readonly cancelPayment = async (amount: string, currencyCode: string, authorizeCode: string, linkNumberRrn: string) => {
    const request = this.cancelOrRefundRequest(amount, currencyCode, authorizeCode, linkNumberRrn)
    return JSON.parse((await EitherAsync(() => SmartSaleTerminal.cancelPayment(request)).mapLeft(_ => new Error()).run()).extract().toString())
  }
  public readonly setTerminalId = async (terminalId: string) => {
    const request = (await EitherAsync(() => SmartSaleTerminal.setTerminalId(terminalId)))
    console.log(request)
    return request
  }
  public readonly getTerminalStatus = async () => {
    return (await EitherAsync(() => SmartSaleTerminal.getTerminalStatus()))
  }
  public readonly restartDevice = async () => {
    return (await EitherAsync(() => SmartSaleTerminal.restartDevice()))
  }
}
