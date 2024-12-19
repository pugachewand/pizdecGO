import { PaymentSystem } from "../../BackendEntities/Payment/PaymentRepoEntity"
import { SimpleCheckGoodInfoEntity } from "./ProductEntity"

export type CheckItemRequestEntity = {
	posId: number
	label: string
	posOperationId: number
}


export enum PosModel {
	Undefined = 0,
	N = 1,
	R = 2,
	Z = 3,
	RDirectGpio = 4,
	ZDirectGpio = 5,
	SelfShopOne = 6,
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
}

export interface IPurchaseInitiationResponse {
	status: PosOperationStatusEntity | null
	posOperationId: number
	posId: number
	posType: PosTypeEntity
	posModel: PosModel
	settings: any
	brandAccountId: number
	usingFiscalization: boolean
	paymentMethodTypes: PaymentMethodType[]
	paymentSystem: PaymentSystem
	countryIso: string
	bonusPayPercent: number
}
type PurchaseInitiationDoorConfigEntity = Partial<{
	needToOpen: boolean
	doorsCount: number
	isClosable: boolean
}>
export type PurchaseInitiationSettingsEntity = Partial<{
	doorConfig: PurchaseInitiationDoorConfigEntity
}>
export interface PurchaseInitiationRequestEntity {
	qrCode: string,
	doorPosition: DoorPositionEntity,
}

export enum DoorPositionEntity {
	Left = 0,
	Right = 1,
}

export interface SimpleCheckEntity {
	id: number
	items: SimpleCheckItemEntity[]
	dateCreated: Date
	datePaid: Date | null
	correctnessStatus: CorrectnessStatusEntity
	summary: SimpleCheckSummaryEntity
	originInfo: CheckOriginInfoEntity
	fiscalizationInfo: FiscalizationInfoEntity | null
	paymentError: UnpaidCheckErrorEntity | null
	status: PosOperationStatusEntity
	currency: string
	usingFiscalization: boolean
	paymentMethodTypes: PaymentMethodType[]
}
export enum CorrectnessStatusEntity {
	NotChecked = 0,
	Incorrect = 1,
	Correct = 2,
}
export type DetailedSimpleCheckItemEntity = {
	price: number
	discount: number
	label: string
	labeledGoodId: number
}

export type SimpleCheckItemEntity = {
	goodInfo: SimpleCheckGoodInfoEntity
	quantity: number
	costSummary: SimpleCheckCostSummaryEntity
	statusInfo: SimpleCheckStatusEntity
	fiscalizationInfo: FiscalizationInfoEntity | null
	detailedItems: DetailedSimpleCheckItemEntity[]
}
export type SimpleCheckSummaryEntity = {
	costSummary: SimpleCheckCostSummaryEntity
	bonusInfo: SimpleCheckBonusInfoEntity
}

export type SimpleCheckCostSummaryEntity = {
	costWithoutDiscount: number
	costWithDiscount: number
	discount: number
	currency: CurrencyEntity
	itemsQuantity: number
	isFree: boolean
	isEmpty: boolean
}
export type CurrencyEntity = {
	id: number
	name: string
	isoCode: string
}
export type SimpleCheckStatusEntity = {
	dateModified: Date
	status: SimpleCheckStatus
}
export enum SimpleCheckStatus {
	Unmodified = 0,
	Added = 1,
	Deleted = 2
}
type CheckOriginInfoEntity = {
	posName: string
	posType: PosTypeEntity
	posId: number
	settings: string
	brandAccountId: number
	posModel: number
	bonusPayPercent: number
	countryIso: string
	paymentSystem: PaymentSystem
}

export enum PosTypeEntity {
	Undefined = 0,
	Rfid = 1,
	QrCode = 2,
	WebQrCode = 3,
}
export type FiscalizationInfoEntity = {
	fiscalNumber: string
	sign: string
	dateOfPurchase: string
	qrCodeValue: string
	fiscalCheckLink: string | null
	status: FiscalizationCompletionStatus
	qrCodeLink: string
}

export enum FiscalizationCompletionStatus {
  Undefined = 0,
  None = 1, // фискализация не требуется
  Pending = 2, // ожидает фискализации
  Processing = 3, // в обработке
  Error = 4, // ошибка фискализации
  Posted = 5, // передано на фискализацию в сервис фискализации
  Success = 6, // успешно фискализировано
}


export type UnpaidCheckErrorEntity = {
	status: number
	message: string | null
	nextPaymentAttemptDate: Date | null
	paymentErrorType: UnpaidCheckPaymentErrorTypeEntity
}
export enum UnpaidCheckPaymentErrorTypeEntity {
	BankError = 0,
	NotEnoughTimeWentBetweenPaymentRepeats = 1,
	PaymentProcessError = 2,
	InvalidPaymentSystem = 3,
	NoLinkedPaymentCard = 4
}

export enum PosOperationStatusEntity {
	Success = 0,
	IncorrectQrCode = 1,
	NegativeBalance = 2,
	LastPosOperationIncomplete = 3,
	PurchaseNotAllowed = 4,
	InfrastructureFailure = 5,
	UserPurchaseIsBlocked = 6,
	PosIsUnavailable = 7,
	PosReportsError = 8,
	UserProfileNotFoundError = 9,
	WebPurchasesAreBlocked = 10,
	PaymentMethodsNotConfigured = 11,
	PosIsAlreadyOpenedForPurchase = 12, // SelfShopOne refused
	PosIsOccupiedByVisitor = 13, // SelfShopOne refused
	PaymentCardNotFound = 14,
	InvalidPaymentSystem = 15, // Payment system doesnt fit with current active
	MobileAppDisabled = 19 // Mobile app doest support purchase
}

export type SimpleCheckBonusInfoEntity = {
	writtenOffBonusAmount: number
	accruedBonusAmount: number
}

export enum PurchaseCancellationStatusEntity {
	Success = 0,
	OperationForUserDoesNotFound = 1,
	OperationIsNotQrPurchase = 2,
	PurchaseHasWrongStatus = 3,
	UnexpectedError = 4,
	PurchaseAlreadyCancelled = 5,
	PurchaseHasAlreadyPaid = 6,
	PosOperationIsLockedAnotherRequest = 7,
}
export type PurchaseCancellationResultEntity = {
	status: PurchaseCancellationStatusEntity
	error: string | null
}
export enum BonusPromotionsStatusEntity {
	Success = 0,
	ValidationError = 1,
	MappingError = 2,
	SaveError = 3,
	GetError = 4,
	DeleteError = 5,
	UnknownError = 20
}
export type defaultPromotionEntity = {
	succeeded: boolean
	error: string
	status: BonusPromotionsStatusEntity
}
export type BonusCheckItem = {
	bonusPromotionId: number
	labeledGoods: number[]
	bonusAmount: number
}

export type ActiveBonusPromotionEntity = {
	value: BonusCheckItem[]
} & defaultPromotionEntity

