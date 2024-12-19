import { IAuthPreferencesFactory, IPreferencesFactory } from './Preferences.Type'

import { AppEnvironment } from '../../Infrastructure/Auth/BackendMode'
import { AsyncStorageFacade } from '../../Logic/Persistence/AsyncStorageFacade'
import { AsyncStoragePreferencesFactoryEnum } from './AsyncStoragePreferencesFactoryEnum'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { LanguagesKeys } from '../i18nProvider'
import { SecureStorageFacade } from '../../Logic/Persistence/SecureStorageFacade'
import { UnexpectedError } from '../../Infrastructure/Exceptions/Errors'
import { UserCredentials } from '../../Infrastructure/Auth/UserCredentials'
import { globalContext } from '../AppContext'

export class AsyncStoragePreferencesFactory implements IPreferencesFactory {
	private readonly eventBus = globalContext.eventBus.value

	private readonly withErrorHandlingAsync = async <T>(action: () => Promise<T>) => {
		let isError = false
		const either = await EitherAsync(action)
			.mapLeft(error => {
				isError = true
				return new UnexpectedError({
					error: 'async storage preferences factory error',
					description: JSON.stringify(error),
				})
			})
			.run()
		this.eventBus.emit({
			analyticsCategory: isError ? 'Errors' : 'ReadFromDeviceStorage',
			moduleName: AsyncStoragePreferencesFactoryEnum.Module,
			screenName: AsyncStoragePreferencesFactoryEnum.AsyncStorageScreen,
			functionalityName: AsyncStoragePreferencesFactoryEnum.AsyncStorageSettings,
			result: either,
			suppressUserError: true,
		})
		return either
	}

	getAppEnvironment = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('appEnvironment'))
	setEnvironment = (env: AppEnvironment) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('appEnvironment', env))

	getCustomBackendAddress = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('customBackendAddress'))
	setCustomBackendAddress = (value: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('customBackendAddress', value))

	getQrCodeShowcase = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('qrCodeShowcase'))
	setQrCodeShowcase = (value: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('qrCodeShowcase', value))

	getPosToken = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('posToken'))
	setPosToken = (value: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('posToken', value))

	getPaymentReconciliationDate = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('paymentReconciliationDate'))
	setPaymentReconciliationDate = (value: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('paymentReconciliationDate', value))

	getPaymentReconciliationFrequency = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('paymentReconciliationFrequency'))
	setPaymentReconciliationFrequency = (value: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('paymentReconciliationFrequency', value))

	getAppStartDate = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('appStartDate'))
	setAppStartDate = (value: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('appStartDate', value))

	getTerminalId = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('terminalId'))
	setTerminalId = (value: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('terminalId', value))

	getLanguage = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('language'))
	setLanguage = (lng: LanguagesKeys) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('language', lng))

	getStartKey = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('startKey'))
	setStartKey = (key: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('startKey', key))

	getUuid = () => this.withErrorHandlingAsync(() => AsyncStorageFacade.getValue('uuid'))
	setUuid = (uuid: string) => this.withErrorHandlingAsync(() => AsyncStorageFacade.setValueAsync('uuid', uuid))
}

export class AsyncStorageAuthPreferencesFactory implements IAuthPreferencesFactory {

	private readonly eventBus = globalContext.eventBus.value

	private readonly withErrorHandlingAsync = async <T>(action: () => Promise<T>) => {
		let isError = false
		const either = await EitherAsync(action)
			.mapLeft(error => {
				isError = true
				return new UnexpectedError({
					error: 'async storage auth preferences factory error',
					description: JSON.stringify(error),
				})
			})
			.run()

		this.eventBus.emit({
			analyticsCategory: isError ? 'Errors' : 'ReadFromDeviceStorage',
			moduleName: AsyncStoragePreferencesFactoryEnum.Module,
			screenName: AsyncStoragePreferencesFactoryEnum.AsyncStorageAuthScreen,
			functionalityName: AsyncStoragePreferencesFactoryEnum.AsyncStorageSettingsAuth,
			result: either,
		})
		return either
	}

	getCredentials = () => this.withErrorHandlingAsync(() => SecureStorageFacade.getValueAsync('userCredentials'))

	setCredentials = (creds: UserCredentials | null) => {
		let action
		if (creds === null) {
			action = () => SecureStorageFacade.deleteValueAsync('userCredentials')
		}
		else {
			action = () => SecureStorageFacade.setValue('userCredentials', creds)
		}
		return this.withErrorHandlingAsync(action)
	}
}
