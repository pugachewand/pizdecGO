import { FailureDebugCause, FailureSeverity, IMqttClient, RemoteCommandEnum } from '../IMqttClient';
import { AppIoCContainer } from '../../../../Infrastructure/Objects/AppIoContainer';
import { IMqttIncomeMessage, IMqttIncomeMessageHandler } from '../abstractions/IMqttIncomeMessage';
import { ILogger } from '../../../Logger/ILogger';
import {
    generateFailureDebugInfo,
    generateFailureInfoParams,
    sendFailureInfoToRabbitMqAsync
} from '../MqttClientMessageRouting';

export class MqttIncomeMessageHandler implements IMqttIncomeMessageHandler{
    private readonly _mqttClient: IMqttClient;
    private readonly ModuleName = "MqttIncomeMessageHandler"
    private readonly _logger: ILogger

    public constructor(logger: ILogger) {
        this._logger = logger
        this._mqttClient = AppIoCContainer.getMqttClient();
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this._logger.LogInfo(this.ModuleName, "Created MqttIncomeMessageHandler")
    }
    removeListenersOnMessageReceived = () => {
        this._mqttClient.removeListener('onMessage', this.onMessageReceived)
    }
    subscribeListenerOnMessageReceived = () => {
        this._mqttClient.addListener('onMessage', this.onMessageReceived);
    }
    /**
   * Происходит каждый раз как приходит новое сообщение
   * @param fromTopic Из какого топика пришло сообщение
   * @param message Сообщение которое пришло из топика `fromTopic`
   */
    private onMessageReceived(fromTopic: string, message: string) {
        const appSettings = AppIoCContainer.getAppSettings();
        const remoteCommandProvider = AppIoCContainer.getRemoteCommandProvider();
        const topic = fromTopic && fromTopic?.replaceAll
            ? fromTopic?.replaceAll('/', '.')?.toLowerCase() ?? ''
            : '';
        // console.log('appSettings topic', topic);
         console.log('fromTopic', fromTopic);
         console.log('message', message);
        if (appSettings.mqtt.posSensorMeasurementTopic.toLowerCase() === topic) {
            const objectAvailability = AppIoCContainer.getObjectActivityRegister();
            objectAvailability.updatePosActivity();
            return;
        }

        if (appSettings.mqtt.sstCommandsMessageTopic.toLowerCase() === topic) {
            let msg: IMqttIncomeMessage | undefined;

            try {
                msg = JSON.parse(message) as IMqttIncomeMessage
            }
            catch { /* NOTHING TO DO */ }

            if (!msg || !msg.M || !msg.H) {
                return;
            }

            if (this.isExpectedCommand(msg.H, 'SelfShopTerminal')) {
                const command = msg.M

                if (this.processIsExpectedCommandAndNeedExecute(command,
                    RemoteCommandEnum.MAKE_RECONCILIATION_OF_TOTALS, FailureDebugCause.RECONCILIATION_OF_TOTALS)
                )
                    remoteCommandProvider.raiseMakeReconciliationOfTotalsEvent();

                if(this.processIsExpectedCommandAndNeedExecute(command,
                    RemoteCommandEnum.RESTART_POS_TERMINAL, FailureDebugCause.RESTART_POS_TERMINAL)
                )
                    remoteCommandProvider.raiseRestartPosTerminalEvent();
            }
        }
    }

    private processIsExpectedCommandAndNeedExecute(command: string, expectedCommand: RemoteCommandEnum, logCause: FailureDebugCause): boolean {
        if (!this.isExpectedCommand(command, expectedCommand))
            return false;

        console.log(command + ' command received')
        const debugInfo = generateFailureDebugInfo(0, command + ' command received', '')
        const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, logCause)
        sendFailureInfoToRabbitMqAsync(failureInfoParams)

        return true;
    }

    private isExpectedCommand(value: string, expected: string) : boolean {
        return value.toLowerCase() === expected.toLowerCase();
    }
}
