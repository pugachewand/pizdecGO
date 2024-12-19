import {
    generateFailureDebugInfo,
    generateFailureInfoParams, sendFailureInfoToRabbitMqAsync
} from '../../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity } from '../../../Core/connections/MqttClient/IMqttClient';
import { PaymentServiceAdapter } from '../../../Adapter/SmartSaleTerminalAdapter';
import { PosTerminalOperationStatusEnum } from '../../../Tabs/Payment/PaymentEnum';
import { AppIoCContainer } from '../AppIoContainer';

export const restartPosTerminalAsync = async () => {
    const posTerminalLinkWithBankErrorProvider = AppIoCContainer.getPosTerminalLinkWithBankErrorProvider()
    const paymentService = new PaymentServiceAdapter()
    const resultOfRestartDeviceEither = (await paymentService.restartDevice()).unsafeCoerce()
    const resultOfRestartDevice = JSON.parse(resultOfRestartDeviceEither)
    console.log('resultOfRestartDevice::: ', resultOfRestartDevice)
    const debugInfo = generateFailureDebugInfo(resultOfRestartDevice?.response?.operationId || 0,
        resultOfRestartDevice?.response?.posTerminalOperationStatus || '', resultOfRestartDevice?.errorMessage || '')
    const failureInfoParams = generateFailureInfoParams(
        debugInfo,
        FailureSeverity.Normal,
        FailureDebugCause.RESTART_POS_TERMINAL
    )
    sendFailureInfoToRabbitMqAsync(failureInfoParams)
    posTerminalLinkWithBankErrorProvider.cleanConnectionErrorCount()
    return resultOfRestartDevice?.response?.posTerminalOperationStatus === PosTerminalOperationStatusEnum.APPROVED
}
