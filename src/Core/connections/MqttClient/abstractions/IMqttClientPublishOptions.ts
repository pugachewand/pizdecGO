import { QoS } from "precompiled-mqtt"

export interface IMqttClientPublishOptions {
	qos?: QoS
	retain?: boolean
	dup?: boolean
}
