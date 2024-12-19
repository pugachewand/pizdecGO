/* eslint-disable no-restricted-syntax, no-shadow */
export enum CardTypeEntity {
	Visa = 1,
	MasterCard = 2,
	Pay = 3
}
export type ActivePaymentCardEntity = {
	id: number
	number: {
		lastFourDigits: string
	} | null
	expirationDate: Date | null
	type: CardTypeEntity
	isActive: boolean
}
export type BrandBonus ={
	brandAccountId: number
	brandName: string
	bonusAmount: number
	currency: string
}
export enum Gender {
	Undefined = 0,
	Male = 1,
	Female = 2
}
export type UserInfoEntity = {
	email: string | null
	fullName: string | null
	gender: Gender
	goal: number | null
	activity: number | null
	pregnancy: number | null
	age: number | null
	height: number | null
	weight: number | null
	birthDateMillis:  number | null
	disablePushUserMessages: boolean | null
}
export type UserEntity = {
	minutesToWaitForNextSmsAttempt: number
	attemptsLeft: number
	wasSmsSent: boolean
	brandBonuses: BrandBonus[]
	phoneNumber: string | null
	phoneNumberConfirmed: boolean
	activePaymentCard: ActivePaymentCardEntity | null
	availableBonusPoints: number
	birthDate: Date | null
	id: number
	userName: string | null
	isDeniedBuying: boolean
	disablePushUserMessages: boolean
} & UserInfoEntity

export enum StatusLanguageEnum {
	Success = 0,
	Invalid = 1,
	NotFound = 2,
	InvalidIso = 3,
	SuccessDefaultEng = 4,
}

export type UserLanguageEntity = {
	status: StatusLanguageEnum
	succeeded: boolean
	error: string | null
}


export enum UserRegistrationStatusEntity {
	None = 0,
	PhoneNumberConfirmed = 1,
	BankingCardConfirmed = 2,
}
