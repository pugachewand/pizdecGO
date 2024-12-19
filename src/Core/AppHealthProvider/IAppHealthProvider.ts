export interface IAppHealthProvider {
    readonly isIziPosAvailable: boolean;
    readonly isMqttBrokerAvailable: boolean;
    readonly isAppServerAvailable: boolean;
    readonly isPosTerminalAvailable: boolean;
    readonly isScannerAvailable: boolean;
    readonly isPosTerminalLinkWithBankEstablished: boolean;
    readonly isHealthDegraded: boolean;
    readonly lastCheckedLinkWithBankTime: Date | null;
    subscribers: HealthDegradedCallbackType[];
    setIziPosAvailability: (connected: boolean) => void;
    setMqttBrokerAvailability: (connected: boolean) => void;
    setAppServerAvailability: (connected: boolean) => void;
    setPosTerminalAvailability: (connected: boolean) => void;
    setScannerAvailability: (connected: boolean) => void;
    setPosTerminalLinkWithBankEstablished: (connected: boolean) => void;
    setLastCheckedLinkWithBankTime: (time: Date) => void;
    notify: () => void;
    subscribe: (callback: HealthDegradedCallbackType) => void;
    unsubscribe: (callback: HealthDegradedCallbackType) => void;
    getServiceNoConnection:() => string[];
}
export type HealthDegradedCallbackType = (isHealthDegraded: boolean) => void;
