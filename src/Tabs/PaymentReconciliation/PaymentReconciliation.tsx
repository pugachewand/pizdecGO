import { NativeEventEmitter, ScrollView,View } from 'react-native';
import { PaymentOperationStatusCode, PosTerminalOperationStatusEnum } from '../Payment/PaymentEnum';
import { useCallback, useContext, useState } from 'react';

import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine';
import { CheckRepo } from '../../Logic/RestApi/Check/CheckRepo';
import { CustomText } from '../../Components/_Common/CustomText/CustomText';
import { Loader } from '../../Components/_Common/Loaders/Loaders';
import { PaymentServiceAdapter } from '../../Adapter/SmartSaleTerminalAdapter';
import { PaymentSystem } from '../../BackendEntities/Payment/PaymentRepoEntity';
import { dateToISOLikeButLocal } from '../../Logic/Date/DateToLocalISO';
import { globalContext } from '../../DependencyInjection/AppContext';
import { PaymentReconciliationStyles as s } from './PaymentReconciliation.Styles';
import { useFocusEffect } from '@react-navigation/native';
import {
    generateFailureDebugInfo,
    generateFailureInfoParams,
    sendFailureInfoToRabbitMqAsync,
    sendPosTerminalOperationInfoToRabbitMqAsync,
} from '../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity } from '../../Core/connections/MqttClient/IMqttClient';
import { PosTerminalOperationType } from '../../Core/connections/MqttClient/abstractions';

interface IROTOnEndResult {
    isFinished: boolean,
    data: {
        request: {
            operation: string,
            operationId: number,
            rawData: string,
            terminalId: string
        },
        response: {
            additionalResponseData: string | null,
            operation: string,
            operationId: number,
            posTerminalOperationStatus: PosTerminalOperationStatusEnum
            rawData: string,
            terminalId: string,
            transactionIdInExternalDevice: number
        },
        createdDate: string,
        errorCode: PosTerminalOperationStatusEnum | null,
        errorMessage: string | null,
        requestDate: string,
        responseDate: string,
        succeeded: boolean,
    } | null
}
export const PaymentReconciliation = () => {
    const [state, send, service] = useContext(AppFlowMachineContext);
    const isManualROT = state.event.isManualROT;
    const eventEmitter = new NativeEventEmitter();
    const paymentService = new PaymentServiceAdapter()
    const checkRepo = new CheckRepo()


    const [status, setStatus] = useState<String[]>([])
    const startReconciliationAsync = async () => {
        console.log('startReconciliationAsync')
        if (isManualROT) {
            const result = await paymentService.reconciliateOfTotals()
            if (result === null) {
                send(AppFlowEvents.SUCCESS)
                return
            }
            const resultNew = {isFinished: true, data: result}
            reconciliationOnProgress(JSON.stringify(resultNew))
            finishReconciliationAsync(JSON.stringify(resultNew))
        }
        else {
            await paymentService.beginReconciliateOfTotals(true)
        }
    }

    const getStatusOfRot = (ROTResult: IROTOnEndResult) => {
        if (ROTResult.data && (ROTResult.data.succeeded === false || ROTResult.data.succeeded === null)) {
            return PaymentOperationStatusCode.POSTERMINAL_FAILED
        }
        else if (ROTResult.data && ROTResult.data.response.posTerminalOperationStatus === PosTerminalOperationStatusEnum.APPROVED) {
            return PaymentOperationStatusCode.Success
        }
        else {
            return PaymentOperationStatusCode.OPERATION_FAILED
        }
    }

    const sendResultToBackAsync = async (data: IROTOnEndResult) => {
        if (globalContext.preferences.value.qrCodeShowcase !== null) {
            const dataToSave = {
                paymentSystem: PaymentSystem.PrimiKartu,
                posQrCode: globalContext.preferences.value.qrCodeShowcase,
                status: getStatusOfRot(data),
                requestJson: data.data && JSON.stringify(data.data.request) || 'null',
                responseJson: data.data && JSON.stringify(data.data.response) || 'null',
            }
            try {
                const result = await checkRepo.saveROTResult(dataToSave)
                console.log("result::::::::", result)
            }
            catch {
                console.log ('Сверка не была отправлена на бэк')
                throw new Error('Сверка не была отправлена на бэк')
            }
        }
    }
    const finishReconciliationAsync = async (event: any) => {
        const preferences = globalContext.preferences.value
        const dateToSave = dateToISOLikeButLocal(new Date())
        try {
            const parsedJson = JSON.parse(event) as IROTOnEndResult
            console.log('parsedJson:::', parsedJson)
            if (parsedJson.data && parsedJson.data.succeeded === true && !isManualROT) {
                preferences.setAppStartDate(dateToSave)
            }
            const failureSeverity = parsedJson.data && parsedJson.data.response.posTerminalOperationStatus === PosTerminalOperationStatusEnum.APPROVED ? FailureSeverity.Lowest : FailureSeverity.Normal
            const debugInfo = generateFailureDebugInfo(getStatusOfRot(parsedJson), parsedJson.data?.response?.posTerminalOperationStatus || '', parsedJson.data?.errorMessage || '')
            const failureInfoParams = generateFailureInfoParams(
                debugInfo,
                failureSeverity,
                FailureDebugCause.RECONCILIATION_OF_TOTALS
                )
            sendFailureInfoToRabbitMqAsync(failureInfoParams)

            const posTerminalOperationInfoParams = {
                operationType: PosTerminalOperationType.RECONCILIATION_OF_TOTALS,
                succeeded: (parsedJson.data !== null && parsedJson.data.response !== null && parsedJson.data.response.posTerminalOperationStatus === PosTerminalOperationStatusEnum.APPROVED)
              }
            await sendPosTerminalOperationInfoToRabbitMqAsync(posTerminalOperationInfoParams)

            await sendResultToBackAsync(parsedJson)
        }
        catch (e) {
            const debugInfo = generateFailureDebugInfo(1, ' ' + e, event)
            const failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Normal,
                FailureDebugCause.RECONCILIATION_OF_TOTALS
            )
            sendFailureInfoToRabbitMqAsync(failureInfoParams)
        }
        send(AppFlowEvents.SUCCESS)
    }
    const reconciliationOnProgress = (event: string) => {
        const date = new Date();
        const milliSeconds = date.getMilliseconds();
        const seconds = date.getSeconds();
        const minutes = date.getMinutes();
        const hour = date.getHours();
        const logWithDate = hour + ':' + minutes + ':' + seconds + ':' + milliSeconds + ' ' + event
        // console.log('On Progress:::: ', logWithDate)
        setStatus(o => [...o, logWithDate])
    }
    useFocusEffect(
        useCallback(() => {
            const ROROTOnProgress = eventEmitter.addListener('ROTOnProgress', event => {
                reconciliationOnProgress(event)
            });
            const ROTOnEnd = eventEmitter.addListener('ROTOnEnd', event => {
                finishReconciliationAsync(event)
                console.log('ROTOnEnd::',event)
            });
            startReconciliationAsync()
            return () => {
                // eventEmitter.removeAllListeners('ROTOnProgress')
                ROROTOnProgress && ROROTOnProgress.remove()
                ROTOnEnd && ROTOnEnd.remove()
                eventEmitter.removeAllListeners('ROTOnEnd')
            }
        }, [])
    );
    return(
        <View style={s.container}>
            <Loader />
            <ScrollView style={s.scrollableView}>
                {status.map(el => <CustomText key={el.toString()} style={s.status}>{el}</CustomText>)}
            </ScrollView>
        </View>
    )
}
