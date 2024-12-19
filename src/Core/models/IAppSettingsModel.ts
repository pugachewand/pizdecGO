import { IMqttSettingsModel } from "Core/connections/MqttClient/abstractions";

export interface IAppSettingsModel {
    /**
     * Настройки MQTT канала связи
     */
    mqtt: IMqttSettingsModel;

    /**
     * Идентификатор поса
     */
    posId: number;

    isVirtual: boolean;

    qrCode: string;
}