
/**
 * Названия объектов, для которых нужно проверять состояние доступности
 */
export enum ApplicationHealthProviderItemName {
    /**
     * Объект, для проверки доступа к API izipoint
     */
    isAppServerAvailable = 'AppServer',

    /**
     * Объект, для проверки доступа izipoint izi-pos
     */
    isIziPosAvailable = 'kit-pos',

    /**
     * Объект, для проверки доступа mqtt broker-а
     */
    isMqttBrokerAvailable = 'RabbitMq',

    /**
     * Объект, для проверки доступа pos-terminal
     */
    isPosTerminalAvailable = 'POS-terminal',

    /**
     * Объект, для проверки доступа scanner
     */
    isScannerAvailable = 'Barcode scanner',

    /**
     * Объект, для проверки связи POS-терминала c банком
     */
    isPosTerminalLinkWithBankEstablished = 'POS-terminal with bank.',

}
