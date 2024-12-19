import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { ApplicationHealthProviderItemName } from '../../Infrastructure/Objects/ObjectAvailabilityVerifiers/types';
import { globalContext } from '../../DependencyInjection/AppContext';

/**
 * Определяет, нужно ли выполнять проверку для данного состояния и сервиса с использованием switch-case.
 * @param {string} service - Сервис, для которого выполняется проверка.
 * @returns {boolean} Возвращает true, если проверка требуется, иначе false.
 */
export function shouldPerformCheck(service: ApplicationHealthProviderItemName) {
    const state = globalContext.navigatorRef.value.current?.getCurrentRoute()?.name || ''
    switch(state) {
        case AppFlowStates.EngineeringMenu as AppFlowStates:
            return [ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.UsbDevicesCheck as AppFlowStates:
            return [ApplicationHealthProviderItemName.isPosTerminalAvailable,
                ApplicationHealthProviderItemName.isScannerAvailable,
                ApplicationHealthProviderItemName.isPosTerminalLinkWithBankEstablished,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.Init as AppFlowStates:
            return [ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.PurchaseInvitation as AppFlowStates:
            return [ApplicationHealthProviderItemName.isPosTerminalAvailable,
                ApplicationHealthProviderItemName.isPosTerminalLinkWithBankEstablished,
                ApplicationHealthProviderItemName.isScannerAvailable,
                ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isIziPosAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.PurchaseInit as AppFlowStates:
            return [ApplicationHealthProviderItemName.isPosTerminalAvailable,
                ApplicationHealthProviderItemName.isScannerAvailable,
                ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isIziPosAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.BasketFormation as AppFlowStates:
            return [ApplicationHealthProviderItemName.isPosTerminalAvailable,
                ApplicationHealthProviderItemName.isScannerAvailable,
                ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.Payment as AppFlowStates:
            return [ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.PurchaseCancel as AppFlowStates:
            return [ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        case AppFlowStates.PurchaseSuccess as AppFlowStates:
            return [ApplicationHealthProviderItemName.isAppServerAvailable,
                ApplicationHealthProviderItemName.isMqttBrokerAvailable].includes(service);

        default:
            return false;
    }
}
