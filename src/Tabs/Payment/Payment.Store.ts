import {
  MakePaymentRequest,
  MakePaymentResponse,
  SmartSaleTerminalMakePaymentCommand
} from '../../NativeModules/Android/SmartSaleTerminal/SmartSaleTerminal'
import {
  PaymentInfoFromPosTerminal,
  PaymentMethodType,
  PaymentStage,
  PaymentSystem,
} from '../../BackendEntities/Payment/PaymentRepoEntity'
import { PaymentOperationStatusCode, PaymentStatusEnum, PosTerminalOperationStatusEnum } from './PaymentEnum'
import { action, makeObservable, observable } from 'mobx'

import { CheckRepo } from '../../Logic/RestApi/Check/CheckRepo'
import { Lce } from '../../Infrastructure/Lce'
import { PaymentServiceAdapter } from '../../Adapter/SmartSaleTerminalAdapter'
import { globalContext } from '../../DependencyInjection/AppContext'
import { FailureDebugCause, FailureSeverity } from '../../Core/connections/MqttClient/IMqttClient';
import { AppIoCContainer } from '../../Infrastructure/Objects/AppIoContainer';
import {
  generateFailureDebugInfo,
  generateFailureInfoParams,
  sendFailureInfoToRabbitMqAsync,
  sendPosTerminalOperationInfoToRabbitMqAsync,
} from '../../Core/connections/MqttClient/MqttClientMessageRouting';
import { mapPaymentOperationStatusCode, mapPrimiKartuOperationStatusCode } from './PaymentStatusCode';
import { mapPurchaseResponseToMessage } from '../PurchaseInit/PurchaseInit.Store';
import { PosTerminalOperationType } from '../../Core/connections/MqttClient/abstractions';
import { HttpError } from '../../Infrastructure/Exceptions/Errors';

//TODO: Креш приложения при отсоединении терминала

interface InitiatePurchaseAsyncProps {
  amount: string
  currency: string
  posOperationId: number
  paymentMethodType: PaymentMethodType
  paymentStage: PaymentStage
  paymentSystem: PaymentSystem
}


export class PaymentStore {


  lceState: Lce = 'loading'
  terminalDisconnect = false
  terminalPaymentCode = 0
  appHealthProvider = AppIoCContainer.getAppHealthProvider()
  constructor() {
    makeObservable(this, {
      //observer
      terminalDisconnect: observable,
      terminalPaymentCode: observable,


      //actions
      setTerminalDisconnect: action,
      setTerminalPaymentCode: action
    })
  }

  setTerminalDisconnect = (terminalStatus: boolean) => {
    this.terminalDisconnect = terminalStatus
  }
  setTerminalPaymentCode = (terminalPaymentCode: number) => {
    this.terminalPaymentCode = terminalPaymentCode
  }
    // 7.1 Проверка состояния пос терминала. Если ошибка то сообщить о ней.
  // TODO: 7.2 Кнопка повторить перейти в п.п. 7.1

  // TODO: 7.3 Кнопка "Отменить покупку" перейти в "Отмена покупки"
  // 7.4 Вызов платежного терминала и получение json от него. Если ошибка терминала(коряво отработал апи) перейти в п.п. 7.1
  // 7.5 Передача полученного json в бэк через PayCheckExternal. TODO: Если ошибка, то повторить этот пункт.
  // 7.6 Если платеж успешен, то перейти в "Успешная покупка"
  // TODO: 7.7 Если ошибка платежа, то сообщить ошибку.
  // TODO: 7.8 Кнопка "Повторить оплату", перейти в п.п. 7.1
  // TODO: 7.9 Аналог 7.3

  //TODO: Оставаться в payment state при не подключенном терминале

  private readonly testInfo: PaymentInfoFromPosTerminal = {
    type: 10,
    bankTransactionId: 'testTransaction',
    dateCreated: 'testDate',
    amount: 2,
    status: 2,
    errorMessage: '',
    nativeErrorCode: '',
    nativeErrorMessage: '',
    requestJson: {
      requestJson: 'test Request',
    },
    responseJson: {
      responseJson: 'test Response',
    },
  }


  private readonly transformPaymentErrorToPaymentOperationStatusCode = (response: MakePaymentResponse | null): number => {

    if(response == null) return PaymentOperationStatusCode.Failed

    if(response?.paymentStatus === PaymentStatusEnum.PAID){
      return PaymentOperationStatusCode.Success
    }

    switch(response.posTerminalOperationStatus) {
      case PosTerminalOperationStatusEnum.EMERGENCY_CANCEL: return PaymentOperationStatusCode.EMERGENCY_CANCEL
      case PosTerminalOperationStatusEnum.NO_CONNECTION: return PaymentOperationStatusCode.NO_CONNECTION
      case PosTerminalOperationStatusEnum.OPERATION_ABORTED: return PaymentOperationStatusCode.OPERATION_ABORTED
      case PosTerminalOperationStatusEnum.DENIED: return PaymentOperationStatusCode.DENIED
    }
    return PaymentOperationStatusCode.POSTERMINAL_FAILED
  }
  private readonly makeBankTransactionId = (operationInfo: SmartSaleTerminalMakePaymentCommand): string => {
    return `${operationInfo.request?.terminalId ?? ''}.${operationInfo.createdDate}`
  }
  private readonly getPaymentOperationInfo = (operationInfo: SmartSaleTerminalMakePaymentCommand): PaymentInfoFromPosTerminal => {
    const request:MakePaymentRequest | null = operationInfo.request
    return {
      type: 10,
      bankTransactionId: this.makeBankTransactionId(operationInfo),
      dateCreated: operationInfo.createdDate,
      amount: request?.amount ?? 0,
      status: Number(!operationInfo.succeeded ? PaymentOperationStatusCode.Failed : this.transformPaymentErrorToPaymentOperationStatusCode(operationInfo.response)),
      errorMessage: operationInfo.errorMessage,
      // TODO: POSTERMINAL OPERATION STATUS нужно достать числовое значение
      nativeErrorCode: operationInfo.response?.posTerminalOperationStatus ?? null,
      //TODO: сделать развернутую расшивровку кода
      nativeErrorMessage: operationInfo.response?.additionalResponseData ?? null,
      requestJson: JSON.stringify(request),
      responseJson: JSON.stringify(operationInfo.response),
    }
  }



  private readonly processPaymentByTerminalAsync = async (amount: string, currency: string, posOperationId: number) => {
    const paymentService = new PaymentServiceAdapter()
    // const eventBus = globalContext.eventBus.value
    // Получаем инфу от терминала, отправляем это обратно в initiatePurchaseAsync
    // const getResponseFromTerminal = await terminalPay(amount)
    const terminalId = globalContext.preferences.value.terminalId
    console.log('terminalId_______________________________________________', terminalId)
    if(terminalId) {

      // TODO: debug Mode
    // Раскоментить для дебага
    // const resultEither = await new Promise((res) => setTimeout(() => res(terminalSuccess()), 115000))
    // const resultEither:any = await new Promise((res) => setTimeout(() => res(terminalAborted()), 5000))

      return await paymentService.makePayment(amount, currency, posOperationId)
    }
    console.log('Terminal ID not found on makePayment::')
    const debugInfo = generateFailureDebugInfo(1, '', 'Terminal ID not found on makePayment')
    const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.PAYMENT_PURCHASE)
    sendFailureInfoToRabbitMqAsync(failureInfoParams)
    return null
    // Если по какой то причине Терминал САМ коряво отрботал(!!!) вернул например 404 или ошибку без информации, то запускаем processPaymentByTerminalAsync еще раз
  }

  private readonly sendDataToBack = async (props: InitiatePurchaseAsyncProps, result: any, tryCount: number ) => {

    const checkRepo = new CheckRepo()
    const payCheck = await checkRepo.payCheck({
      paymentSystem: PaymentSystem.PrimiKartu,
      paymentMethodType: props.paymentMethodType,
      posOperationId: Number(props.posOperationId),
      paymentStage: PaymentStage.StageOne,
      paymentOperationInfo: this.getPaymentOperationInfo(result)
    })

    // TODO: Оповещение пользователя если не может отправить данные в бэк
    if (payCheck.value.isLeft()) {
      console.log('Error to send back payCheck::', payCheck.value)

      const debugInfo = generateFailureDebugInfo(1, '', 'Error to send back payCheck::', Number(props.posOperationId))
      const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Critical, FailureDebugCause.PAYMENT_PURCHASE)
      sendFailureInfoToRabbitMqAsync(failureInfoParams)

      if (tryCount > 1) {
        await this.sendDataToBack(props, result, tryCount - 1)
      }
    }
    return payCheck
  }



  private readonly payCheckAsync = async (props: InitiatePurchaseAsyncProps) => {
    // Если PoS готов к работе то отправляем запрос на терминал
    const result = await this.processPaymentByTerminalAsync(props.amount, props.currency, Number(props.posOperationId))
    if(!result) return null
    if(!result.succeeded) {
      console.log(`POS terminal not available:: ${JSON.stringify(result.response)}`)

      const debugInfo = generateFailureDebugInfo(Number(result?.response?.hostResponseCode), mapPrimiKartuOperationStatusCode(this.terminalPaymentCode) || '', 'POS terminal not available')
      const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.PAYMENT_PURCHASE)
      sendFailureInfoToRabbitMqAsync(failureInfoParams)

      const paymentService = new PaymentServiceAdapter()
      const isPosTerminalAvailability = (await paymentService.getTerminalStatus()).unsafeCoerce()
      this.appHealthProvider.setPosTerminalAvailability(isPosTerminalAvailability)
      this.setTerminalDisconnect(!result.succeeded)
      return null
    }

    const posTerminalOperationInfoParams = {
        operationType: PosTerminalOperationType.PAYMENT,
        succeeded: (result.response !== null && result.response?.paymentStatus === PaymentStatusEnum.PAID)
      }
    sendPosTerminalOperationInfoToRabbitMqAsync(posTerminalOperationInfoParams)

    const sendDataEither = await this.sendDataToBack(props, result, 0)

    const rawData = result?.response?.hostResponseCode
    if (rawData) {
      const safResponseCodeValue = rawData.replace(/(?<=^|-)0+/, '')
      if (!isNaN(Number(safResponseCodeValue))) {
        this.setTerminalPaymentCode(parseInt(safResponseCodeValue))
      }
    }
    if(sendDataEither.value.isLeft()) {
      const errorData = sendDataEither.value.swap().unsafeCoerce();
      const errorMessage = errorData instanceof HttpError && errorData.axiosError.message  || "Unknown error";
      console.log(`Error check payment to send:: ${errorMessage}`)

      const debugInfo = generateFailureDebugInfo(1, '', 'Error check payment to send ' + errorMessage)
      const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.PAYMENT_PURCHASE)
      sendFailureInfoToRabbitMqAsync(failureInfoParams)

      return null
    }

    return sendDataEither
  }

  public payOnPress = async (props: InitiatePurchaseAsyncProps) => {
    const resultEither = await this.payCheckAsync(props)
    let debugInfo = ''
    let failureInfoParams
    try {
      const result = resultEither?.value.unsafeCoerce()

      if(result?.success) {
        debugInfo = generateFailureDebugInfo(result?.nextCheck?.status || 0, mapPurchaseResponseToMessage(result?.nextCheck?.status || 0), '', props.posOperationId, parseFloat(props.amount))
        failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, FailureDebugCause.PAYMENT_PURCHASE)
      }
      if(result?.paymentError) {
        if(this.terminalPaymentCode !== 0) {
          debugInfo = generateFailureDebugInfo(this.terminalPaymentCode,
              mapPrimiKartuOperationStatusCode(this.terminalPaymentCode) || '', result?.paymentError.toString() || '')
          failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.PAYMENT_PURCHASE)
        } else {
          debugInfo = generateFailureDebugInfo(result?.paymentError?.status || 2,
              mapPaymentOperationStatusCode(result?.paymentError?.status) || '', result?.paymentError.toString() || '')
          failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.PAYMENT_PURCHASE)
        }
        sendFailureInfoToRabbitMqAsync(failureInfoParams)
      }
    }catch (e) {
      console.log('Error to parse resultPayEither::', e)
      debugInfo = generateFailureDebugInfo(1, '', 'Error to parse resultPayEither::' + e, props.posOperationId)
      failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.PAYMENT_PURCHASE)
      sendFailureInfoToRabbitMqAsync(failureInfoParams)
    }


    if(resultEither) {
      if(resultEither.value.isLeft()) {
        return null
      }
      return resultEither.value.unsafeCoerce()
    }
    return null
  }
}
