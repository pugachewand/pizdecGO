import { ILogger } from "Core/Logger/ILogger";
import { IRemoteCommandProvider, SubscriberCallback } from '../../../Core/RemoteCommandProvider/IRemoteCommandProvider';
import { RemoteCommandEnum } from '../../../Core/connections/MqttClient/IMqttClient';



export class RemoteCommandProvider implements IRemoteCommandProvider {

    private readonly ModuleName = "RemoteCommandProvider"
    private readonly _logger: ILogger
    subscribers: any = []
    public constructor(logger: ILogger) {
        this._logger = logger
        this.subscribers = []
        this._logger.LogInfo(this.ModuleName, "Created RemoteCommandProvider")
    }

    // Метод подписки на изменения
    subscribe = (callback: SubscriberCallback): void => {
        this.subscribers.push(callback);
    }

    // Метод отписки от изменений
    unsubscribe = (callback: SubscriberCallback): void => {
        this.subscribers = this.subscribers.filter((subscriber: SubscriberCallback) => subscriber !== callback);
    }

    // Метод уведомления подписчиков об изменениях
    notify = (arg?: any): void => {
        this.subscribers.forEach((subscriber: SubscriberCallback) => subscriber(arg));
    }

    // Поднятие события для выполнения сверки итогов
    raiseMakeReconciliationOfTotalsEvent = (): void => {
        console.log('in raiseMakeReconciliationOfTotalsEvent:: Initiating reconciliation');
        this.notify({ event: RemoteCommandEnum.MAKE_RECONCILIATION_OF_TOTALS, success: true });
    }

    // Поднятие события для выполнения перезагрузки POS терминала
    raiseRestartPosTerminalEvent = (): void => {
        console.log('in raiseRestartPosTerminalEvent:: Initiating POS terminal restarting');
        this.notify({ event: RemoteCommandEnum.RESTART_POS_TERMINAL, success: true });
    }
}
