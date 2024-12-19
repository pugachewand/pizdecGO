import { AppIoCContainer } from '../AppIoContainer';
import {
    IApplicationHealthProviderVerifier,
    IApplicationHealthProviderVerifierResult
} from '../../../Core/ApplicationHealthProviderVerifier/types';
import { Nullable } from '../../../Core/connections/MqttClient/abstractions';
import { ApplicationHealthProviderItemName } from '../ObjectAvailabilityVerifiers/types';
import { registerStatusChangedServiceToRabbitMq } from '../../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause } from '../../../Core/connections/MqttClient/IMqttClient';
import { shouldPerformCheck } from '../../../Core/AppHealthProvider/shouldPerformCheck';


/**
 * Класс для проверки доступности объектов
 */
export class ObjectAvailabilityCheckerHandler {

    checkObjectAvailabilityAsync = async (objectAvailabilityVerifier: IApplicationHealthProviderVerifier) => {
        let result: Nullable<IApplicationHealthProviderVerifierResult> = null;
        const applicationHealthProviderItem = objectAvailabilityVerifier.objectId as ApplicationHealthProviderItemName;
        const appHealthProvider = AppIoCContainer.getAppHealthProvider()
        let needCheck
        try {
            result = await objectAvailabilityVerifier.verifyAsync();
            switch (applicationHealthProviderItem) {
                case ApplicationHealthProviderItemName.isIziPosAvailable as ApplicationHealthProviderItemName:
                    if(appHealthProvider.isIziPosAvailable !== result.isAvailable) {
                        registerStatusChangedServiceToRabbitMq(result.isAvailable, FailureDebugCause.STATUS_KIT_POS)
                    }
                    needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isIziPosAvailable)
                    if (needCheck) {
                        appHealthProvider.setIziPosAvailability(result.isAvailable)
                    }
                    break;
                case ApplicationHealthProviderItemName.isAppServerAvailable as ApplicationHealthProviderItemName:
                    if(appHealthProvider.isAppServerAvailable !== result.isAvailable) {
                        registerStatusChangedServiceToRabbitMq(result.isAvailable, FailureDebugCause.STATUS_APP_SERVER)
                    }
                    needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isAppServerAvailable)
                    if (needCheck) {
                        appHealthProvider.setAppServerAvailability(result.isAvailable)
                    }
                    break;
                case ApplicationHealthProviderItemName.isMqttBrokerAvailable as ApplicationHealthProviderItemName:
                    if(appHealthProvider.isMqttBrokerAvailable !== result.isAvailable) {
                        registerStatusChangedServiceToRabbitMq(result.isAvailable, FailureDebugCause.STATUS_RABBITMQ)
                    }
                    needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isMqttBrokerAvailable)
                    if (needCheck) {
                        appHealthProvider.setMqttBrokerAvailability(result.isAvailable)
                    }
                    break;
            }
        }
        catch (er) {
            console.log('Error on check object availability:::', er)
        }
        return
    }
    healthProviderItemAvailabilitySetStatusAsync = async () => {
        const objectsToVerify = AppIoCContainer.getApplicationHealthProviderVerifyAvailability();

        for (const getObjectVerifier of objectsToVerify) {
            const objectVerifier = getObjectVerifier();
            await this.checkObjectAvailabilityAsync(objectVerifier);
        }
    }
}


