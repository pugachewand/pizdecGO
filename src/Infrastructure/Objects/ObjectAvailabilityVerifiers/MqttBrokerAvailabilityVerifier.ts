import { BaseAvailabilityVerifier } from './base/BaseAvailabilityVerifier'
import { ILogger } from '../../../Core/Logger/ILogger'
import { ApplicationHealthProviderItemName } from './types'
import { AppIoCContainer } from '../AppIoContainer'

/**
 * Класс для проверки доступности MQTT брокера сообщений
 */
export class MqttBrokerAvailabilityVerifier extends BaseAvailabilityVerifier {

    public isRequired = true
    protected get thisId(): string {
        return 'MqttBrokerAvailabilityVerifier'
    }

    public constructor(logger: ILogger) {
        super(logger, ApplicationHealthProviderItemName.isMqttBrokerAvailable)
    }
    protected async verifyInternalAsync(): Promise<boolean> {
        return await new Promise(resolve => {
            const mqttClient = AppIoCContainer.getMqttClient()
            const wait = setTimeout(() => {
                clearTimeout(wait); resolve(mqttClient.isConnected)
            }, 1000)
        })
    }
}
