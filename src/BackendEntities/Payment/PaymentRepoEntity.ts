import { SimpleCheckEntity, UnpaidCheckErrorEntity } from '../Cart/PurchaseRepoEntity';

export interface IPaymentEntity {
	paymentSystem: PaymentSystem
	paymentMethodType: PaymentMethodType
	posOperationId: number
	paymentStage: PaymentStage
	paymentCardId?: number
	cardCryptogramPacket?: string
	clientIpAddress?: string
	transactionId?: string
	paRes?: string,
	isSaveCard?:boolean,
	cryptogramSource?: PaymentCardCryptogramSourceEntity,
	paymentOperationInfo: PaymentInfoFromPosTerminal
}

export enum PaymentMethodType {
	Undefined = 0,
	GooglePay = 1,
	ApplePay = 2,
	BankingCard = 3,
	YandexPay = 4,
	BankingCardByToken = 5,
	Sbp = 7,
	PosSber = 11,
	TerminalGo = 12,
}

export interface PaymentInfoFromPosTerminal {
	type: number,
	bankTransactionId: string,
	dateCreated: string,
	amount: number,
	status: number,
	errorMessage: string | null,
	nativeErrorCode: string | null,
	nativeErrorMessage: string | null,
	requestJson: any,
	responseJson: any,
}

export enum PaymentStage {
	Undefined = 0,
	StageOne = 1,
	StageTwo = 2,
}

export enum PaymentSystem {
	Undefined = 0,
	CloudPayments = 1,
	Stripe = 2,
	CloudPaymentsUz = 3,
	PrimiKartu = 4,
}

export enum PaymentCardCryptogramSourceEntity {
	Common = 0,
	ApplePay = 1,
	GooglePay = 2,
	YandexPay = 3,
}

export type UnpaidCheckPaymentResultEntity = {
	success: boolean
	paymentError?: UnpaidCheckErrorEntity
	nextCheck?: SimpleCheckEntity
	nextPaymentAttemptDate: Date
}

export interface ISaveROTResult {
	paymentSystem: PaymentSystem,
	posQrCode: string,
	status: number,
	requestJson: string,
	responseJson: string,
}