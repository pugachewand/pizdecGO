import AppFlowStates from '../../../../Machines/AppFlow/AppFlowStates';

export type MqttEvents = 'onMessage' | 'onStopListen' | 'onConnected' | 'onReconnecting';

export type MqttEventListener<eventName extends MqttEvents>
	= eventName extends 'onMessage'
	? (fromTopic: string, message: string) => void
	: () => void

export type Nullable<T> = T | null
export enum DevicesStatusEnum {
	KIT_POS_OFFLINE = 32,
	APP_SERVER_OFFLINE = 16,
	MQTT_OFFLINE = 8,
	TERMINAL_NO_LINK_WITH_BANK = 4,
	TERMINAL_OFFLINE = 2,
	SCANNER_OFFLINE = 1,
	ALL_OK = 0,
}

export enum PosTerminalOperationType {
	PAYMENT = 1,
	RECONCILIATION_OF_TOTALS = 2,
}

export enum QosStatus {
	LESS_IMPORTANT_PERIODIC_MESSAGE = 0,
	EXACTLY_SEND_MESSAGE_DUPLICATED = 1,
	IMPORTANT_MESSAGE_NOT_DUPLICATED = 2,
}

export const ScreenNameObject: Record<AppFlowStates, string> = {
	[AppFlowStates.Init] : 'Authorization',
	[AppFlowStates.UsbDevicesCheck] : 'Devices Check',
	[AppFlowStates.PurchaseInit] : 'Initial Purchase',
	[AppFlowStates.NotReady] : 'Initial Purchase',
	[AppFlowStates.PurchaseInvitation] : 'Purchase Invitation',
	[AppFlowStates.PurchaseCancel] : 'Purchase Cancel',
	[AppFlowStates.BasketFormation] : 'Cart',
	[AppFlowStates.Payment] : 'Payment',
	[AppFlowStates.Support] : 'Support',
	[AppFlowStates.PurchaseSuccess] : 'Purchase Success',
	[AppFlowStates.PaymentReconciliation] : 'Payment Reconciliation',
	[AppFlowStates.EngineeringMenu] : 'Engineering Menu',
}

