import { MqttClient } from '../../../Core/connections/MqttClient'
import { IMqttClient, IMqttClientConnection } from '../../../Core/connections/MqttClient/IMqttClient'
import initDIContainer from '../../../Core/IoCContainer'
import { InjectScope } from '../../../Core/IoCContainer/types'
import { ILogger } from '../../../Core/Logger/ILogger'
import { AppLogger } from '../AppLogger'
import { IocRegisteredObject } from './enums/IocRegisteredObject'
import { IAppSettingsModel } from '../../../Core/models/IAppSettingsModel'
import { ObjectActivityRegister } from '../ObjectActivityRegister'
import { IApplicationHealthProviderVerifier } from '../../../Core/ApplicationHealthProviderVerifier/types'
import { IzipointApiAvailabilityVerifier } from '../ObjectAvailabilityVerifiers/IzipointApiAvailabilityVerifier'
import { IziPosAvailabilityVerifier } from '../ObjectAvailabilityVerifiers/IziPosAvailabilityVerifier'
import { MqttBrokerAvailabilityVerifier } from '../ObjectAvailabilityVerifiers/MqttBrokerAvailabilityVerifier'
import { IBatteryHealthProvider } from '../../../Core/Battery/IBatteryHealthProvider'
import { BatteryHealthProvider } from '../BatteryHealth'
import { IAppHealthProvider } from '../../../Core/AppHealthProvider/IAppHealthProvider';
import { AppHealthProvider } from '../AppHealthProvider';
import { MqttClientConnection } from '../../../Core/connections/MqttClient/MqttClientConnection';
import { RemoteCommandProvider } from '../RemoteCommandProvider';
import { IRemoteCommandProvider } from '../../../Core/RemoteCommandProvider/IRemoteCommandProvider';
import { MqttIncomeMessageHandler } from '../../../Core/connections/MqttClient/MqttIncomeMessageHandler';
import { IMqttIncomeMessageHandler } from '../../../Core/connections/MqttClient/abstractions/IMqttIncomeMessage';
import { IPosTerminalLinkWithBankErrorProvider } from '../../../Core/PosTerminalLinkWithBankErrorProvider/IPosTerminalLinkWithBankErrorProvider';
import { PosTerminalLinkWithBankErrorProvider } from '../PosTerminalLinkWithBankErrorProvider';

const appLogger = new AppLogger()
const appIoCContainer = initDIContainer<IocRegisteredObject>(appLogger)
let appSettings: IAppSettingsModel = {
	mqtt: {
		url: 'string',
		username: 'string',
		password: 'string',
		queueName: 'string',
		heartbeatTopic: 'string',
		posSensorMeasurementTopic: 'string',
		failureInfoTopic: 'string',
		posTerminalOperationsTopic: 'string',
		sstCommandsMessageTopic: 'string',
	},
	posId: 0,
	isVirtual: false,
	qrCode: 'string'
}

appIoCContainer.register<ILogger>(
	InjectScope.SINGLETON,
	IocRegisteredObject.LOGGER,
	_ => appLogger,
)
appIoCContainer.register(
	InjectScope.SINGLETON,
	IocRegisteredObject.HEALTH_PROVIDER_OBJECT_TO_VERIFY_AVAILABILITY,
	(c): (() => IApplicationHealthProviderVerifier)[] => {
		const logger = c.resolve<ILogger>(IocRegisteredObject.LOGGER)
		return [
			() =>
				new IzipointApiAvailabilityVerifier(
					logger
				),
			() => new IziPosAvailabilityVerifier(logger),
			() => new MqttBrokerAvailabilityVerifier(logger),
		]
	},
)
appIoCContainer.register<ObjectActivityRegister>(
	InjectScope.SINGLETON,
	IocRegisteredObject.HEALTH_PROVIDER_OBJECT_ACTIVITY_REGISTER,
	() => new ObjectActivityRegister(),
)
appIoCContainer.register<IMqttClient>(
	InjectScope.SINGLETON,
	IocRegisteredObject.MQTT_CLIENT,
	c => {
		const logger = c.resolve<ILogger>(IocRegisteredObject.LOGGER)
		return new MqttClient(logger, () => {
				return {
					keepalive: 30,
					protocolId: 'MQTT',
					protocolVersion: 4,
					clean: true,
					reconnectPeriod: 7000,
					connectTimeout: 30 * 1000,
					rejectUnauthorized: false,
					clientId: `${appSettings.mqtt.queueName}-`,
					username: appSettings.mqtt.username,
					password: appSettings.mqtt.password,

				}
		})

	},
)
appIoCContainer.register<IBatteryHealthProvider>(
	InjectScope.SINGLETON,
	IocRegisteredObject.BATTERY_HEALTH_PROVIDER,
	c => new BatteryHealthProvider(
		c.resolve<ILogger>(IocRegisteredObject.LOGGER)
	)
)

appIoCContainer.register<IAppHealthProvider>(
	InjectScope.SINGLETON,
	IocRegisteredObject.APP_HEALTH_PROVIDER,
	c => new AppHealthProvider(
		c.resolve<ILogger>(IocRegisteredObject.LOGGER)
	)
)
appIoCContainer.register<IMqttClientConnection>(
	InjectScope.SINGLETON,
	IocRegisteredObject.MQTT_CLIENT_CONNECTION,
	() => new MqttClientConnection()
)

appIoCContainer.register<IRemoteCommandProvider>(
	InjectScope.SINGLETON,
	IocRegisteredObject.REMOTE_COMMAND_PROVIDER,
	c => new RemoteCommandProvider(
		c.resolve<ILogger>(IocRegisteredObject.LOGGER)
	)
)

appIoCContainer.register<IMqttIncomeMessageHandler>(
	InjectScope.SINGLETON,
	IocRegisteredObject.MQTT_INCOME_MESSAGE_HANDLER,
	c => new MqttIncomeMessageHandler(
		c.resolve<ILogger>(IocRegisteredObject.LOGGER)
	)
)

appIoCContainer.register<IPosTerminalLinkWithBankErrorProvider>(
	InjectScope.SINGLETON,
	IocRegisteredObject.POS_TERMINAL_LINK_WITH_BANK_ERROR_PROVIDER,
	c => new PosTerminalLinkWithBankErrorProvider(
		c.resolve<ILogger>(IocRegisteredObject.LOGGER)
	)
)
// TODO: добавить регистрацию класса обработчика ответа на вопрос о начале сверки итогов

export const AppIoCContainer = {
	instance: appIoCContainer,
	getLogger: () =>
		appIoCContainer.resolve<ILogger>(IocRegisteredObject.LOGGER),
	getObjectActivityRegister: () =>
		appIoCContainer.resolve<ObjectActivityRegister>(
			IocRegisteredObject.HEALTH_PROVIDER_OBJECT_ACTIVITY_REGISTER,
		),
	getApplicationHealthProviderVerifyAvailability: () =>
		appIoCContainer.resolve<(() => IApplicationHealthProviderVerifier)[]>(
			IocRegisteredObject.HEALTH_PROVIDER_OBJECT_TO_VERIFY_AVAILABILITY,
		),
	getMqttClient: () =>
		appIoCContainer.resolve<IMqttClient>(IocRegisteredObject.MQTT_CLIENT),
	setAppSettings: (props: IAppSettingsModel) => appSettings = props,
	getAppSettings: () => appSettings,
	getBatteryHealthProvider: () =>
		appIoCContainer.resolve<IBatteryHealthProvider>(IocRegisteredObject.BATTERY_HEALTH_PROVIDER),
	getAppHealthProvider: () =>
		appIoCContainer.resolve<IAppHealthProvider>(IocRegisteredObject.APP_HEALTH_PROVIDER),
	getRemoteCommandProvider: () =>
		appIoCContainer.resolve<IRemoteCommandProvider>(IocRegisteredObject.REMOTE_COMMAND_PROVIDER),
	getMqttIncomeMessageHandler: () =>
		appIoCContainer.resolve<IMqttIncomeMessageHandler>(IocRegisteredObject.MQTT_INCOME_MESSAGE_HANDLER),
	getMqttClientConnection: () =>
		appIoCContainer.resolve<IMqttClientConnection>(IocRegisteredObject.MQTT_CLIENT_CONNECTION),
	getPosTerminalLinkWithBankErrorProvider: () =>
		appIoCContainer.resolve<IPosTerminalLinkWithBankErrorProvider>(IocRegisteredObject.POS_TERMINAL_LINK_WITH_BANK_ERROR_PROVIDER),
}
