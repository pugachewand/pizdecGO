
/**
 * Интерфейс приходящих сообщений по MQTT
 */
export interface IMqttIncomeMessage {
    /**
     * Метод
     */
    M: string;
    /**
     * к какому объекту пренадлежит
     */
    H: string;

}

export interface IMqttIncomeMessageHandler {
    removeListenersOnMessageReceived: () => void;
    subscribeListenerOnMessageReceived: () => void;
}
