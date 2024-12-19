import { AppIoCContainer } from '../../../Infrastructure/Objects/AppIoContainer';
import { globalContext } from '../../../DependencyInjection/AppContext';
import { PosTerminalOperationType, QosStatus } from './abstractions';
import AppFlowStates from '../../../Machines/AppFlow/AppFlowStates';
import {
    generateFailureDebugInfo,
    generateFailureInfoParams,
    getPosSettingsAsync,
    sendFailureInfoToRabbitMqAsync
} from './MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity, IMqttClientConnection } from './IMqttClient';

export interface failureInfoParams {
    state:AppFlowStates,
    currentFunction:string,
    severity: number,
    postToHotline: boolean,
    cause?: string
}
export interface posTerminalOperationInfoParams {
    operationType: PosTerminalOperationType,
    succeeded: boolean
}
export class MqttClientConnection implements IMqttClientConnection {
    mqtt = AppIoCContainer.getMqttClient()
    logger = AppIoCContainer.getLogger()
    onFirstMqttClientConnected = () => {
        const appSettings = AppIoCContainer.getAppSettings()
        this.mqtt.subscribe([
            appSettings.mqtt.heartbeatTopic,
            appSettings.mqtt.failureInfoTopic,
            appSettings.mqtt.posSensorMeasurementTopic,
            appSettings.mqtt.posTerminalOperationsTopic,
            appSettings.mqtt.sstCommandsMessageTopic
        ], {
            qos: QosStatus.LESS_IMPORTANT_PERIODIC_MESSAGE,
        })
        this.mqtt.removeListener('onConnected', this.onFirstMqttClientConnected)
    }
    connectToRabbitMqAsync = async () => {
        console.log('globalContext.preferences.value.posToken', globalContext.preferences.value.posToken)
        if (globalContext.preferences.value.posToken) {
            const mappedSettings = await getPosSettingsAsync(globalContext.preferences.value.posToken)
            if(mappedSettings === null) {
                throw new Error('Error while trying to get to posSettings::: ')
            }
            try {
                if (mappedSettings?.mqtt.url && !this.mqtt.isConnected) {
                    globalContext.preferences.value.setQrCodeShowcase(mappedSettings.qrCode)
                    this.mqtt.addListener('onConnected', this.onFirstMqttClientConnected);
                    this.mqtt.connect(mappedSettings.mqtt.url);
                    const { mqtt: { password, ...mqttWithoutPassword }, ...appSettingsCopy } = mappedSettings
                    console.log('appSettingsCopy - ', appSettingsCopy)
                    console.log('mqttClientSettings - ', mqttWithoutPassword)
                    if(this.mqtt.isConnected) {
                        const debugInfo = generateFailureDebugInfo(0, 'Success', '')
                        const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, FailureDebugCause.STATUS_MQTT_CONNECTION)
                        sendFailureInfoToRabbitMqAsync(failureInfoParams)
                    }

                }
                return this.mqtt.isConnected
            }
            catch (e) {
                throw new Error('error while trying to connect to mqtt::: ' + e)
            }

        }
        else {
            throw new Error('error while trying to get posToken::: ')
        }
    }


}
