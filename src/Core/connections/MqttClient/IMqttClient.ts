import { IMqttClientPublishOptions, IMqttClientSubscribeOptions, MqttEventListener, MqttEvents } from "./abstractions";

export interface IMqttClient {
    readonly isConnected: boolean;
    connect: (brokerUrl: string) => void;
    disconnect: () => void;
    publish: (topic: string, message: string, options: IMqttClientPublishOptions) => void;
    subscribe: (topic: string | string[], options: IMqttClientSubscribeOptions) => void;
    unsubscribe: (topic: string | string[]) => void;
    addListener: <TEvent extends MqttEvents>(event: TEvent, listener: MqttEventListener<TEvent>) => void;
    removeListener: <TEvent extends MqttEvents>(event: TEvent, listener: MqttEventListener<TEvent>) => void;
}
export interface IMqttClientConnection {
    connectToRabbitMqAsync: () => void;
}
export enum FailureSeverity
{
    Critical = 0,
    High = 1,
    Normal = 2,
    Low = 3,
    Lowest = 4
}

export enum FailureDebugCause {
    SET_TERMINAL_ID = 'Set Terminal ID',
    STATUS_MQTT_CONNECTION = 'Status MQTT Connection',
    STATUS_GET_POS_SETTINGS = 'Status get pos settings',
    INITIATE_APP = 'Initiate app',
    INITIATE_PURCHASE = 'Initiate purchase',
    PAYMENT_PURCHASE = 'Payment purchase',
    CANCEL_PURCHASE = 'Cancel purchase',
    BASKET_ITEM_ADD = 'Add basket item',
    BASKET_ITEM_REMOVE = 'Remove basket item',
    RECONCILIATION_OF_TOTALS = 'Reconciliation of totals',
    RESTART_POS_TERMINAL = 'Restart POS terminal',
    STATUS_TERMINAL_LINK_WITH_BANK = 'Status terminal link with bank',
    STATUS_BARCODE_SCANNER = 'Status barcode scanner',
    STATUS_POS_TERMINAL = 'Status POS terminal',
    STATUS_APP_SERVER = 'Status AppServer',
    STATUS_KIT_POS = 'Status KitPos',
    STATUS_RABBITMQ = 'Status RabbitMq',
}

export enum RemoteCommandEnum {
    MAKE_RECONCILIATION_OF_TOTALS = 'makeReconciliationOfTotals',
    RESTART_POS_TERMINAL = 'restartPosTerminal'
}
