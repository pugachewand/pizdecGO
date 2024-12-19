import { ILogger } from "Core/Logger/ILogger";
import {
	IMqttClientPublishOptions,
	IMqttClientSettings,
	IMqttClientSubscribeOptions,
	MqttEventListener,
	MqttEvents,
	Nullable
} from "./abstractions";
import { IMqttClient } from "./IMqttClient";
import Mqtt from 'precompiled-mqtt'
import { AppIoCContainer } from '../../../Infrastructure/Objects/AppIoContainer';

export const ObjectExtension = {
    deleteProperty: <TObject>(object: TObject, property: keyof TObject): boolean => {
        if (!object) {
            return false;
        }

        if (Object.prototype.hasOwnProperty.call(object, property)) {
            return delete object[property]
        }

        return false;
    },
}

export class MqttClient implements IMqttClient {
	private _client: Nullable<Mqtt.MqttClient> = null
	private _getMqttClientSettings: () => IMqttClientSettings
	private _logger: ILogger
	private _eventSubscribers: Partial<{
		[eventName in MqttEvents]: MqttEventListener<eventName>[]
	}> = {}
	private static get thisId() {
		return 'MqttClient'
	}
	public constructor(
		logger: ILogger,
		getMqttSettings: () => IMqttClientSettings,
	) {
		this._getMqttClientSettings = getMqttSettings
		this._logger = logger

		this.disconnect = this.disconnect.bind(this)
		this.connect = this.connect.bind(this)
		this.assignEventsForClient = this.assignEventsForClient.bind(this)
		this.onMqttBrokerConnect = this.onMqttBrokerConnect.bind(this)
		this.onMqttBrokerError = this.onMqttBrokerError.bind(this)
		this.onMqttBrokerReconect = this.onMqttBrokerReconect.bind(this)
		this.onMqttBrokerMessage = this.onMqttBrokerMessage.bind(this)
		this.publish = this.publish.bind(this)
		this.subscribe = this.subscribe.bind(this)
		this.unsubscribe = this.unsubscribe.bind(this)
		this.removeEventsForClient = this.removeEventsForClient.bind(this)
		this.addListener = this.addListener.bind(this)
	}
	public get isConnected() {
		return this._client?.connected ?? false
	}

	public addListener<TEvent extends MqttEvents>(
		event: TEvent,
		listener: MqttEventListener<TEvent>,
	) {
		if (!this._eventSubscribers[event]) {
			this._eventSubscribers[event] = []
		}
		this._eventSubscribers[event]!.push(listener as any)
	}

	public removeListener<TEvent extends MqttEvents>(
		event: TEvent,
		listener: MqttEventListener<TEvent>,
	) {
		const eventSubscriber = this._eventSubscribers[event]
		if (!eventSubscriber) {
			return
		}
		const index = eventSubscriber.indexOf(listener as any)
		if (index < 0) {
			return
		}

		eventSubscriber.splice(index, 1)

		if (!eventSubscriber.length) {
			ObjectExtension.deleteProperty(this._eventSubscribers, event)
		}
	}

	public connect(brokerUrl: string) {
		const {
			keepalive,
			protocolId,
			protocolVersion,
			clean,
			reconnectPeriod,
			connectTimeout,
			rejectUnauthorized,
			clientId,
			username,
			password,
		} = this._getMqttClientSettings()

		this.disconnect()
		this._client = Mqtt.connect(brokerUrl, {
			keepalive,
			protocolId,
			protocolVersion,
			clean,
			reconnectPeriod,
			connectTimeout,
			rejectUnauthorized,
			clientId,
			username,
			password,
			properties: {
				userProperties: {
					'auto-delete': 'true',
					exclusive: 'true',
				},
			},
		})
		this.assignEventsForClient(this._client)
	}

	public disconnect() {
		if (!this._client) {
			return
		}
		this._logger.LogInfo(MqttClient.thisId, 'MQTT client has stopped work')
		this._client.end(true)
		this._client = null
		const mqttIncomeMessageHandler = AppIoCContainer.getMqttIncomeMessageHandler()
		mqttIncomeMessageHandler.removeListenersOnMessageReceived()
		if (this._eventSubscribers['onStopListen']) {
			this._eventSubscribers['onStopListen'].forEach(onStopListen => {
				onStopListen()
			})
		}
	}

	public publish(
		topic: string,
		message: string,
		options: IMqttClientPublishOptions
	) {
		if (!this._client) {
			return
		}
		this._client.publish(
			topic,
			message,
			{
				qos: options.qos,
				retain: options.retain,
			},
			error => {
				if (error) {
					this._logger.LogError(
						MqttClient.thisId,
						`Can not publish:"${message}".`,
						[error],
					)
				}
			},

		)
	}

	public subscribe(
		topic: string | string[],
		options: IMqttClientSubscribeOptions,
	) {
		if (!this._client) {
			return
		}
		this._client.subscribe(
			topic,
			{
				qos: options.qos,
			},
			error => {
				if (error) {
					this._logger.LogError(MqttClient.thisId, 'Cant subscribe.', [topic, error])
				}
			}
		)
	}

	public unsubscribe(topic: string | string[]) {
		if (!this._client) {
			return
		}
		this._client.unsubscribe(topic)
		this._client.unsubscribe(topic, (error: Error) => {
			this._logger.LogError(MqttClient.thisId, `Can not unsubscribe.`, [
				topic,
				error,
			])
		})
	}

	private assignEventsForClient(client: Mqtt.MqttClient) {
		if (!client) {
			return
		}

		client.on('connect', this.onMqttBrokerConnect)
		client.on('error', this.onMqttBrokerError)
		client.on('reconnect', this.onMqttBrokerReconect)
		client.on('message', this.onMqttBrokerMessage)
	}

	private removeEventsForClient(client: Mqtt.MqttClient) {
		if (!client) {
			return
		}

		client.off('connect', this.onMqttBrokerConnect)
		client.off('error', this.onMqttBrokerError)
		client.off('reconnect', this.onMqttBrokerReconect)
		client.off('message', this.onMqttBrokerMessage)
	}

	private onMqttBrokerConnect() {
		this._logger.LogInfo(MqttClient.thisId, 'MQTT client is connected.')
		const mqttIncomeMessageHandler = AppIoCContainer.getMqttIncomeMessageHandler()
		mqttIncomeMessageHandler.subscribeListenerOnMessageReceived()
		if (this._eventSubscribers['onConnected']) {
			this._eventSubscribers['onConnected'].forEach(onConnected => {
				onConnected()
			})
		}
	}

	private onMqttBrokerError(error: Error) {
		this._logger.LogError(MqttClient.thisId, error.message)
		this.disconnect()
	}

	private onMqttBrokerReconect() {
		this._logger.LogInfo(
			MqttClient.thisId,
			'MQTT client is trying to reconnect...',
		)
		const mqttIncomeMessageHandler = AppIoCContainer.getMqttIncomeMessageHandler()
		mqttIncomeMessageHandler.removeListenersOnMessageReceived()
		if (this._eventSubscribers['onReconnecting']) {
			this._eventSubscribers['onReconnecting'].forEach(onReconnecting => {
				onReconnecting()
			})
		}
	}

	private onMqttBrokerMessage(
		topic: string,
		message: Buffer,
	) {
		if (!this._eventSubscribers['onMessage']) {
			return
		}
		this._logger.LogInfo(
			MqttClient.thisId,
			'MQTT send messages...' + topic + ', ' + message.toString(),
		)
		this._eventSubscribers['onMessage'].forEach(onMessage => {
			onMessage(topic, message.toString())
		})
	}

}
