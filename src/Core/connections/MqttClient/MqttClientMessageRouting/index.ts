import {
    mapFromIReceiveSettingsResponseDtoToISettingsDataModel
} from '../../../../Logic/RestApi/PosSettings/mapFromIRecieveSettingsResponseDtoToISettingsDataModel';
import { IReceiveSettingsResponseDto } from '../../../../Logic/RestApi/PosSettings/PosSettings.types';
import { AppIoCContainer } from '../../../../Infrastructure/Objects/AppIoContainer';
import { PosSettingsRepo } from '../../../../Logic/RestApi/PosSettings/PosSettingsRepo';
import { DevicesStatusEnum, QosStatus, ScreenNameObject } from '../abstractions';
import { PaymentServiceAdapter } from '../../../../Adapter/SmartSaleTerminalAdapter';
import dayjs from 'dayjs';
import { failureInfoParams, posTerminalOperationInfoParams } from '../MqttClientConnection';
import { FailureDebugCause, FailureSeverity } from '../IMqttClient';
import { globalContext } from '../../../../DependencyInjection/AppContext';
import AppFlowStates from '../../../../Machines/AppFlow/AppFlowStates';
import DeviceInfo from 'react-native-device-info';

const terminalAdapter = new PaymentServiceAdapter()
export const getPosSettingsAsync = async (posToken: string) => {
    const posSettingsApi = new PosSettingsRepo()
    let mappedSettings
    let settings
    let debugInfo
    let failureInfoParams

    try {
        settings = await posSettingsApi.getSetting(posToken)
        if(settings.value.isLeft()) {
            return null
        }
        mappedSettings = mapFromIReceiveSettingsResponseDtoToISettingsDataModel(settings.value.unsafeCoerce() as IReceiveSettingsResponseDto)
        AppIoCContainer.setAppSettings(mappedSettings)
        console.log('mappedSettings posId:: ', mappedSettings.posId)
        if(mappedSettings.posId === 0) {
            return null
        }
        debugInfo = generateFailureDebugInfo(0, 'Success', '')
        failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, FailureDebugCause.STATUS_GET_POS_SETTINGS)
    }catch (e) {
        console.log('Error while trying to get to posSettings:::', e)
        debugInfo = generateFailureDebugInfo(1, 'Error while trying to get to posSettings:::', ' ' + e)
        failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.STATUS_GET_POS_SETTINGS)
        return null
    }
    sendFailureInfoToRabbitMqAsync(failureInfoParams)
    return mappedSettings || null
}
export const getStatusOfDevicesAsync = async () => {
    const healthProvider = AppIoCContainer.getAppHealthProvider()
    const hasTerminalConnectionWithBank = terminalAdapter.checkConnectionPeriodic() // Этот вызов метода должен быть асинхронный (без await), чтобы не тормозил пульс
    let resultStatusDevice = DevicesStatusEnum.ALL_OK
    console.log('hasTerminalConnectionWithBank', hasTerminalConnectionWithBank);
    if(!healthProvider.isIziPosAvailable) {
        resultStatusDevice |= DevicesStatusEnum.KIT_POS_OFFLINE
    }

    if(!healthProvider.isAppServerAvailable) {
        resultStatusDevice |= DevicesStatusEnum.APP_SERVER_OFFLINE
    }

    if(!healthProvider.isMqttBrokerAvailable) {
        resultStatusDevice |= DevicesStatusEnum.MQTT_OFFLINE
    }

    if (!hasTerminalConnectionWithBank) {
        resultStatusDevice |=  DevicesStatusEnum.TERMINAL_NO_LINK_WITH_BANK
    }

    if (!healthProvider.isPosTerminalAvailable) {
        resultStatusDevice |=  DevicesStatusEnum.TERMINAL_OFFLINE
    }

    if (!healthProvider.isScannerAvailable) {
        resultStatusDevice |=  DevicesStatusEnum.SCANNER_OFFLINE
    }
    return resultStatusDevice
}

export const generateMessageReadyToUseRabbit = (statusDevice: number) => {
    const bhp = AppIoCContainer.getBatteryHealthProvider()
    const appSettings = AppIoCContainer.getAppSettings()
    const appVersion = DeviceInfo.getVersion()
    try {
        bhp.updateBatteryInfo()
        const messageObject = {
            PosId: appSettings.posId,
            AppVersion: appVersion,
            DevicesStatus: statusDevice,
            BatteryLevel: bhp.batteryLevel,
            BatteryIsCharging: bhp.isBatteryCharging,
            SendDate: dayjs()
        }
        return JSON.stringify(messageObject)
    } catch (error) {
        console.error('message generation for heartbeat failed: ' + error)

        return JSON.stringify({
            PosId: appSettings.posId,
            AppVersion: appVersion,
            DevicesStatus: statusDevice,
            BatteryLevel: 0,
            BatteryIsCharging: false,
            SendDate: dayjs()
        })
    }
}

export const generateFailureDebugInfo = (status: number, message: string, error = '', posOperationId?:number, amount?: number) => {
    const debugInfo = {
        Status: status,
        Message: message,
        Error: error,
        PosOperationId: posOperationId,
        TotalAmount: amount,
    }
    return JSON.stringify(debugInfo)
}
export const generateFailureInfoParams = (currentFunction: string, severity = FailureSeverity.Normal, cause?: string): failureInfoParams => {
    const currentRoute = globalContext.navigatorRef.value.current?.getCurrentRoute()
    return {
        state: currentRoute?.name as unknown as AppFlowStates,
        currentFunction: currentFunction,
        severity: severity,
        postToHotline: false,
        cause: cause
    }
}
export const generateMessageFailureInfoToRabbit = (params: failureInfoParams) => {
    const appSettings = AppIoCContainer.getAppSettings()
    const appVersion = DeviceInfo.getVersion()
    const cause = params.cause || `${ScreenNameObject[params.state]} screen is frozen`
    const messageObject = {
        PosId: appSettings.posId,
        AppVersion: appVersion,
        Source: params.state,
        Severity: params.severity,
        Cause: cause,
        PostToHotline: params.postToHotline,
        DebugInfo : params.currentFunction,
        SendDate: dayjs()
    }
    return JSON.stringify(messageObject)
}

export const generateMessagePosTerminalOperationInfoToRabbit = (params: posTerminalOperationInfoParams) => {
    const appSettings = AppIoCContainer.getAppSettings()
    const appVersion = DeviceInfo.getVersion()
    const messageObject = {
        PosId: appSettings.posId,
        AppVersion: appVersion,
        OperationType: params.operationType,
        Succeeded: params.succeeded,
        SendDate: dayjs()
    }
    return JSON.stringify(messageObject)
}

export const sendInfoToRabbitMqAsync = async () => {
    const mqtt = AppIoCContainer.getMqttClient()
    const appSettings = AppIoCContainer.getAppSettings()
    const statusOfDevices = await getStatusOfDevicesAsync()
    const message = generateMessageReadyToUseRabbit(statusOfDevices)
    console.log('generateMessageReadyToUseRabbit message - ', message)
    mqtt.publish(appSettings.mqtt.heartbeatTopic, message, {qos: QosStatus.IMPORTANT_MESSAGE_NOT_DUPLICATED})
}

export const sendFailureInfoToRabbitMqAsync = async (params: failureInfoParams) => {
    const mqtt = AppIoCContainer.getMqttClient()
    const appSettings = AppIoCContainer.getAppSettings()
    const message = generateMessageFailureInfoToRabbit(params)
    console.log('generateMessageFailureInfoToRabbit message - ', message)
    mqtt.publish(appSettings.mqtt.failureInfoTopic, message, {qos: QosStatus.LESS_IMPORTANT_PERIODIC_MESSAGE})
}
export const getCheckConnectedText = (status: boolean) => status ? 'Connected' : 'Disconnected'

export const registerStatusChangedServiceToRabbitMq = (isDeviceAvailable: boolean, failureDebugCause: FailureDebugCause) => {
    const failureSeverity = isDeviceAvailable ? FailureSeverity.Lowest : FailureSeverity.Normal
    const debugInfo = generateFailureDebugInfo(Number(isDeviceAvailable), getCheckConnectedText(isDeviceAvailable))
    const failureInfoParams = generateFailureInfoParams(
        debugInfo,
        failureSeverity,
        failureDebugCause
    )
    sendFailureInfoToRabbitMqAsync(failureInfoParams)
}

export const sendPosTerminalOperationInfoToRabbitMqAsync = async (params: posTerminalOperationInfoParams) => {
    const mqtt = AppIoCContainer.getMqttClient()
    const appSettings = AppIoCContainer.getAppSettings()
    const message = generateMessagePosTerminalOperationInfoToRabbit(params)
    console.log('sendPosTerminalOperationInfoToRabbitMqAsync message - ', message)
    mqtt.publish(appSettings.mqtt.posTerminalOperationsTopic, message, {qos: QosStatus.IMPORTANT_MESSAGE_NOT_DUPLICATED})
}

