import { HealthDegradedCallbackType } from '../AppHealthProvider/IAppHealthProvider';

export interface IRemoteCommandProvider {
    notify: () => void;
    subscribe: (callback: HealthDegradedCallbackType) => void;
    unsubscribe: (callback: HealthDegradedCallbackType) => void;
    raiseMakeReconciliationOfTotalsEvent: () => void;
    raiseRestartPosTerminalEvent: () => void;
}
// Общий тип для всех возможных коллбэков
export type SubscriberCallback = (arg?: any) => void;
