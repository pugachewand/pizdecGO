export interface IMqttClientSettings {
    /**
     *  10 seconds, set to 0 to disable
     */
    keepalive?: number;
    /**
     * 'MQTT'
     */
    protocolId?: "MQTT" | "MQIsdp" | undefined;

    /**
     * 4
     */
    protocolVersion?: 4 | 5 | 3;
    /**
     * true, set to false to receive QoS 1 and 2 messages while offline
     */
    clean?: boolean;
    /**
     * 1000 milliseconds, interval between two reconnections
     */
    reconnectPeriod?: number;
    /**
     * 30 * 1000 milliseconds, time to wait before a CONNACK is received
     */
    connectTimeout?: number;
    rejectUnauthorized: boolean;

    /**
     * 'mqttjs_' + Math.random().toString(16).substr(2, 8)
     */
    clientId?: string;

    /**
     * User name
     */
    username: string;

    /**
     * Password
     */
    password: string;
}

export interface IMqttSettingsModel {
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
