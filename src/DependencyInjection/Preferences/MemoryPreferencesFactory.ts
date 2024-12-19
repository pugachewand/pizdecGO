import { Either, Right } from 'purify-ts/Either'
import { IAuthPreferencesFactory, IPreferencesFactory, LocalStorageMap } from './Preferences.Type'

import { AppEnvironment } from '../../Infrastructure/Auth/BackendMode'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { LanguagesKeys } from '../i18nProvider'
import { UnexpectedError } from '../../Infrastructure/Exceptions/Errors'
import { UserCredentials } from '../../Infrastructure/Auth/UserCredentials'

export class MemoryPreferencesFactory implements IPreferencesFactory, IAuthPreferencesFactory {
	private readonly storage = new Map<keyof LocalStorageMap, string>()

	private readonly getValue = <T>(key: keyof LocalStorageMap): Either<UnexpectedError, T | null> => {
		const value = this.storage.get(key)
		if (!value) {
			return Right(null)
		}

		return Right(JSON.parse(value) as T)
	}

	private readonly setValue = <T extends keyof LocalStorageMap>(key: keyof LocalStorageMap, value: LocalStorageMap[T]): Either<UnexpectedError, string> => {
		const serialized = JSON.stringify(value)
		this.storage.set(key, serialized)
		return Right(serialized)
	}

	getCredentials = () => EitherAsync.liftEither(this.getValue<UserCredentials>('userCredentials')).run()
	setCredentials = (value: UserCredentials | null) => EitherAsync.liftEither(this.setValue('userCredentials', value ?? '')).run()

	getAppEnvironment = () => EitherAsync.liftEither(this.getValue<AppEnvironment>('appEnvironment')).run()
	setEnvironment = (value: AppEnvironment) => EitherAsync.liftEither(this.setValue('appEnvironment', value)).run()

	getCustomBackendAddress = () => EitherAsync.liftEither(this.getValue<string>('customBackendAddress')).run()
	setCustomBackendAddress = (value: string) => EitherAsync.liftEither(this.setValue('customBackendAddress', value)).run()

	getQrCodeShowcase = () => EitherAsync.liftEither(this.getValue<string>('qrCodeShowcase')).run()
	setQrCodeShowcase = (value: string) => EitherAsync.liftEither(this.setValue('qrCodeShowcase', value)).run()

	getPosToken = () => EitherAsync.liftEither(this.getValue<string>('posToken')).run()
	setPosToken = (value: string) => EitherAsync.liftEither(this.setValue('posToken', value)).run()

	getPaymentReconciliationDate = () => EitherAsync.liftEither(this.getValue<string>('paymentReconciliationDate')).run()
	setPaymentReconciliationDate = (value: string) => EitherAsync.liftEither(this.setValue('paymentReconciliationDate', value)).run()

	getPaymentReconciliationFrequency = () => EitherAsync.liftEither(this.getValue<string>('paymentReconciliationFrequency')).run()
	setPaymentReconciliationFrequency = (value: string) => EitherAsync.liftEither(this.setValue('paymentReconciliationFrequency', value)).run()

	getAppStartDate = () => EitherAsync.liftEither(this.getValue<string>('appStartDate')).run()
	setAppStartDate = (value: string) => EitherAsync.liftEither(this.setValue('appStartDate', value)).run()

	getTerminalId = () => EitherAsync.liftEither(this.getValue<string>('terminalId')).run()
	setTerminalId = (value: string) => EitherAsync.liftEither(this.setValue('terminalId', value)).run()

	getLanguage = () => EitherAsync.liftEither(this.getValue<LanguagesKeys>('language')).run()
	setLanguage = (lng: LanguagesKeys) => EitherAsync.liftEither(this.setValue('language', lng)).run()

	getStartKey = () => EitherAsync.liftEither(this.getValue<string>('startKey')).run()
	setStartKey = (key: string) => EitherAsync.liftEither(this.setValue('startKey', key)).run()

	getUuid = () => EitherAsync.liftEither(this.getValue<string>('uuid')).run()
	setUuid = (uuid: string) => EitherAsync.liftEither(this.setValue('uuid', uuid)).run()
}
