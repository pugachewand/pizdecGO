import { AppEnvironment } from '../../Infrastructure/Auth/BackendMode'
import { EnvironmentVariables } from '../Constants'
import { I18n } from '../../I18n/_Logic/I18n'
import { LanguagesKeys } from '../i18nProvider'
import { Lce } from '../../Infrastructure/Lce'
import { RefreshTokenResponseEntity } from '../../Logic/RestApi/Auth/AuthRepo.Types'
import { StoragePromise } from '../../Infrastructure/Functional'
import { UserCredentials } from '../../Infrastructure/Auth/UserCredentials'

export type IPreferencesFactory = {
	getAppEnvironment: () => StoragePromise<AppEnvironment | null>
	setEnvironment: (mode: AppEnvironment) => StoragePromise<string | null>
	getCustomBackendAddress: () => StoragePromise<string | null>
	setCustomBackendAddress: (address: string) => StoragePromise<string | null>
	getQrCodeShowcase: () => StoragePromise<string | null>
	setQrCodeShowcase: (qrCode: string) => StoragePromise<string | null>
	getPosToken: () => StoragePromise<string | null>
	setPosToken: (token: string) => StoragePromise<string | null>
	getPaymentReconciliationDate: () => StoragePromise<string | null>
	getPaymentReconciliationFrequency: () => StoragePromise<string | null>
	getAppStartDate: () => StoragePromise<string | null>
	setPaymentReconciliationDate: (date: string) => StoragePromise<string | null>
	setPaymentReconciliationFrequency: (frequency: string) => StoragePromise<string | null>
	setAppStartDate: (date: string) => StoragePromise<string | null>
	getTerminalId: () => StoragePromise<string | null>
	setTerminalId: (qrCode: string) => StoragePromise<string | null>
	getLanguage: () => StoragePromise<LanguagesKeys | null>
	setLanguage: (lng: LanguagesKeys) => StoragePromise<string | null>
	getStartKey: () => StoragePromise<string | null>
	setStartKey: (key: string) => StoragePromise<string | null>
	getUuid: () => StoragePromise<string | null>
	setUuid: (uuid: string) => StoragePromise<string | null>
}

export type IAuthPreferencesFactory = {
	getCredentials: () => StoragePromise<UserCredentials | null>
	setCredentials: (creds: UserCredentials | null) => StoragePromise<string | null>
}

export type IAuthPreferences = {
	startKey: string | null
	uuid: string | null
	isAuthorized: boolean
	credentials: UserCredentials | null
	setCredentials: (creds: RefreshTokenResponseEntity) => StoragePromise<string | null>
	forgetCredentials: () => StoragePromise<string | null>
}

export type IPreferences = IAuthPreferences & {
	lceState: Lce
	appEnvironment: AppEnvironment
	setAppEnvironment: (mode: AppEnvironment) => StoragePromise<void>
	customBackendAddress: string | null
	setCustomBackendAddress: (value: string) => StoragePromise<void>
	qrCodeShowcase: string | null
	setQrCodeShowcase: (value: string) => StoragePromise<void>
	terminalId: string | null
	setTerminalId: (value: string) => StoragePromise<void>
	environmentVariables: EnvironmentVariables
	language: LanguagesKeys | null
	setLanguage: (lng: LanguagesKeys) => StoragePromise<void>
	i18n: I18n
	setStartKey: (key: string) => StoragePromise<void>
	setUuid: (uuid: string) => StoragePromise<void>
	paymentReconciliationDate: string | null
	setPaymentReconciliationDate: (value: string) => StoragePromise<void>
	paymentReconciliationFrequency: string | null
	setPaymentReconciliationFrequency: (value: string) => StoragePromise<void>
	appStartDate: string | null
	setAppStartDate: (value: string) => StoragePromise<void>
	posToken: string | null
	setPosToken: (value: string) => StoragePromise<void>
}

export type LocalStorageMap = {
	userCredentials: UserCredentials
	appEnvironment: AppEnvironment
	customBackendAddress: string
	qrCodeShowcase: string
	posToken: string
	paymentReconciliationDate: string
	paymentReconciliationFrequency: string
	appStartDate: string
	terminalId: string
	language: LanguagesKeys
	startKey: string
	uuid: string
}
