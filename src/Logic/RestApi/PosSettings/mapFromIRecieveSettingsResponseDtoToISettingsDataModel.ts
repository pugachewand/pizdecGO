import { IMqttSettingsModel } from "Core/connections/MqttClient/abstractions";
import { ISelfShopTerminalSettings, IReceiveSettingsResponseDto } from "./PosSettings.types";

export function mapFromIReceiveSettingsResponseDtoToISettingsDataModel(dto: IReceiveSettingsResponseDto): ISelfShopTerminalSettings {


    const queueName = dto.mqtt.queueName;

    const posId = dto.posId;
    const isVirtual = dto.isVirtual;
    const qrCode = dto.qrCode;

    const mqttSettings: IMqttSettingsModel = {
        url: dto.mqtt.url,
        username: dto.mqtt.username,
        password: dto.mqtt.password,
        queueName,
        heartbeatTopic: dto.mqtt.heartbeatTopic,
        posSensorMeasurementTopic: dto.mqtt.posSensorMeasurementTopic,
        failureInfoTopic: dto.mqtt.failureInfoTopic,
        posTerminalOperationsTopic: dto.mqtt.posTerminalOperationsTopic,
        sstCommandsMessageTopic: dto.mqtt.sstCommandsMessageTopic,
    }

    return {
        posId,
        qrCode,
        isVirtual,
        mqtt: mqttSettings,
    }
}
