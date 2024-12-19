import { ILogger } from "Core/Logger/ILogger";
import { HealthDegradedCallbackType, IAppHealthProvider } from '../../../Core/AppHealthProvider/IAppHealthProvider';
import { action, makeObservable, observable } from 'mobx';
import { ApplicationHealthProviderItemName } from '../ObjectAvailabilityVerifiers/types';
import ModalController from '../../../Components/_Common/Modal/CustomAlertModalController';

export class AppHealthProvider implements IAppHealthProvider {
    private _isIziPosAvailable = true
    private _isMqttBrokerAvailable = true
    private _isAppServerAvailable = true
    private _isPosTerminalAvailable = true
    private _isScannerAvailable = true
    private _isPosTerminalLinkWithBankEstablished = false
    private _isHealthDegraded = true
    private _lastCheckedLinkWithBankTime : Date | null  = null


    private readonly ModuleName = "AppHealthProvider"
    private readonly _logger: ILogger

    subscribers: any = []

    public constructor(logger: ILogger) {
        this._logger = logger
        this.subscribers = []
        this.updateIsHealthDegraded()
        makeObservable({
            isIziPosAvailable: observable,
            isMqttBrokerAvailable: observable,
            isAppServerAvailable: observable,
            isPosTerminalAvailable: observable,
            isScannerAvailable: observable,
            isPosTerminalLinkWithBankEstablished: observable,
            isHealthDegraded: observable,
            lastCheckedLinkWithBankTime: observable,
            setLastCheckedLinkWithBankTime: action,
            setIziPosAvailability: action,
            setMqttBrokerAvailability: action,
            setAppServerAvailability: action,
            setPosTerminalAvailability: action,
            setScannerAvailability: action,
            setPosTerminalLinkWithBankEstablished: action,
            setHealthDegraded: action,
        })
        this._logger.LogInfo(this.ModuleName, "Created Health provider")
    }
    get isIziPosAvailable(): boolean {
        return this._isIziPosAvailable
    }

    get isMqttBrokerAvailable(): boolean {
        return this._isMqttBrokerAvailable
    }

    get isAppServerAvailable(): boolean {
        return this._isAppServerAvailable
    }

    get isPosTerminalAvailable(): boolean {
        return this._isPosTerminalAvailable
    }

    get isScannerAvailable(): boolean {
        return this._isScannerAvailable
    }

    get isPosTerminalLinkWithBankEstablished(): boolean {
        return this._isPosTerminalLinkWithBankEstablished
    }

    get isHealthDegraded(): boolean {
        return this._isHealthDegraded
    }

    get lastCheckedLinkWithBankTime(): Date | null {
        return this._lastCheckedLinkWithBankTime
    }
    setIziPosAvailability = (isConnection: boolean) => {
        this._logger.LogInfo(ApplicationHealthProviderItemName.isIziPosAvailable,
            ApplicationHealthProviderItemName.isIziPosAvailable + ' ' + isConnection)
        if(this._isIziPosAvailable !== isConnection) {
            this._isIziPosAvailable = isConnection
            this.updateIsHealthDegraded()
        }
        this._isIziPosAvailable = isConnection
    }
    setMqttBrokerAvailability = (isConnection: boolean) => {

        this._logger.LogInfo(ApplicationHealthProviderItemName.isMqttBrokerAvailable,
            ApplicationHealthProviderItemName.isMqttBrokerAvailable + ' ' + isConnection)
        if(this._isMqttBrokerAvailable !== isConnection) {
            this._isMqttBrokerAvailable = isConnection
            this.updateIsHealthDegraded()
        }
        this._isMqttBrokerAvailable = isConnection
    }
    setAppServerAvailability = (isConnection: boolean) => {

        this._logger.LogInfo(ApplicationHealthProviderItemName.isAppServerAvailable,
            ApplicationHealthProviderItemName.isAppServerAvailable + ' ' + isConnection)
        if(this._isAppServerAvailable !== isConnection) {
            this._isAppServerAvailable = isConnection
            this.updateIsHealthDegraded()
        }
        this._isAppServerAvailable = isConnection
    }
    setPosTerminalAvailability = (isConnection: boolean) => {
        if(this._isPosTerminalAvailable !== isConnection) {
            this._logger.LogInfo(ApplicationHealthProviderItemName.isPosTerminalAvailable,
                ApplicationHealthProviderItemName.isPosTerminalAvailable + ' ' + isConnection)
            this._isPosTerminalAvailable = isConnection
            this.updateIsHealthDegraded()
        }
    }
    setScannerAvailability = (isConnection: boolean) => {
        if(this._isScannerAvailable !== isConnection) {
            this._logger.LogInfo(ApplicationHealthProviderItemName.isScannerAvailable,
                ApplicationHealthProviderItemName.isScannerAvailable + ' ' + isConnection)
            this._isScannerAvailable = isConnection
            this.updateIsHealthDegraded()
        }
    }
    setPosTerminalLinkWithBankEstablished = (isConnection: boolean) => {
        if(this._isPosTerminalLinkWithBankEstablished !== isConnection) {
            this._logger.LogInfo(ApplicationHealthProviderItemName.isPosTerminalLinkWithBankEstablished,
                ApplicationHealthProviderItemName.isPosTerminalLinkWithBankEstablished + ' ' + isConnection)
            this._isPosTerminalLinkWithBankEstablished = isConnection
            this.updateIsHealthDegraded()
        }
    }

    setLastCheckedLinkWithBankTime = (time: Date) => {
        this._lastCheckedLinkWithBankTime = time
    }

    setHealthDegraded = (isConnection: boolean) => {
        this._isHealthDegraded = isConnection
    }
    // Метод подписки на изменения
    subscribe = (isDegradedHealth: HealthDegradedCallbackType): void => {
        this.subscribers.push(isDegradedHealth);
    }

    // Метод отписки от изменений
    unsubscribe = (callback: HealthDegradedCallbackType) => {
        if(this.subscribers.length > 0) {
            this.subscribers = this.subscribers.filter((subscriber: HealthDegradedCallbackType) => subscriber !== callback);
        }
    }

    // Метод уведомления подписчиков об изменениях
    notify = () => {
        if(this.subscribers.length > 0) {
            this.subscribers.forEach((subscriber: (arg0: boolean) => any) => subscriber(this._isHealthDegraded));
        }
    }
    updateIsHealthDegraded = () => {
        const isHealthDegraded = !(
            this._isIziPosAvailable &&
            this._isMqttBrokerAvailable &&
            this._isAppServerAvailable &&
            this._isPosTerminalAvailable &&
            this._isScannerAvailable &&
            this._isPosTerminalLinkWithBankEstablished
        )
        this.setHealthDegraded(isHealthDegraded)
        if(!isHealthDegraded) {
            ModalController.hideModal()
        }
        this.notify()
    }
    getServiceNoConnection = ():string[] => {
        const enumValues: ApplicationHealthProviderItemName[] = [];
        const noConnectionServices = [
            '_isIziPosAvailable',
            '_isMqttBrokerAvailable',
            '_isAppServerAvailable',
            '_isPosTerminalAvailable',
            '_isScannerAvailable',
            '_isPosTerminalLinkWithBankEstablished'
        ].filter(prop => !this[prop as keyof this])

        noConnectionServices.forEach(item => {
            const enumValue = ApplicationHealthProviderItemName[item.slice(1) as keyof typeof ApplicationHealthProviderItemName]
            if (enumValue !== undefined) {
                enumValues.push(enumValue)
            }
        })

        return enumValues
    }
}
