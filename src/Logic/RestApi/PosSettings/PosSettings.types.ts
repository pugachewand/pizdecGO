import { IMqttSettingsModel } from "Core/connections/MqttClient/abstractions";

export interface ISelfShopTerminalSettings {

    /**
     * ID Pos-а
     */
    posId: number;

    /**
     * Данные для QR кода
     */
    qrCode: string;

    /**
     * Признак виртуальности витрины
     */
    isVirtual: boolean;

    /**
     * Настройки для mqtt клиента
     */
    mqtt: IMqttSettingsModel;
}

export interface IReceiveSettingsResponseDto {
    posId: number;
    isVirtual: boolean;
    qrCode: string;
    mqtt: {
        url: string;
        username: string;
        password: string;
        queueName: string;
        heartbeatTopic: string;
        posSensorMeasurementTopic: string;
        failureInfoTopic: string;
        posTerminalOperationsTopic: string;
        sstCommandsMessageTopic: string;
    }
}
