import {
	AuthenticateEitherEntity,
	generateAuthRequest,
	generateAuthUuidRequest
} from '../../../Logic/RestApi/Auth/AuthRepo.Types';
import { makeObservable, observable, when } from 'mobx'
import { LanguagesKeys } from '../../../DependencyInjection/i18nProvider'
import { LaunchScreenEnum } from './LaunchScreenEnum'
import { LaunchScreenProps } from './LaunchScreen'
import ModalController from '../../../Components/_Common/Modal/CustomAlertModalController';
import { Right } from 'purify-ts/Either'
import { findBestLanguageTag } from 'react-native-localize'
import forge from 'node-forge';
import { globalContext } from '../../../DependencyInjection/AppContext'
import { v1 as uuidv1 } from 'uuid';
import { setCurrentFunctionType } from '../../../Infrastructure/EmergencyReturn';

type loadUserAsyncParams = {
	setI18n: (val: LanguagesKeys) => void,
	setCurrentFunction?: setCurrentFunctionType
}
export class LaunchScreenStore {

	private readonly moduleAndScreenInfo = {
		moduleName: LaunchScreenEnum.ModuleName,
		screenName: LaunchScreenEnum.ScreenName,
	}
	private readonly preferences = globalContext.preferences.value
	private readonly authRepo = globalContext.restRepos.auth.value
	private readonly eventBus = globalContext.eventBus.value


	// #region state
	shouldUpdate = false
	storeVersion: string | null = null
	isImmediateUpdates = false
	isStabilityVersion = true
	attemptOffer: number | null = null
	isSucceded: boolean = false
	isGetConnectionStatusSucceeded: boolean = false
	isCheckDevicesConnectionStatus: boolean = false
	errorMessage: string | null = null
	errorTitle: string | null = null


	constructor(private readonly props: LaunchScreenProps) {
		makeObservable(this, {
			shouldUpdate: observable,
			storeVersion: observable,
			isImmediateUpdates: observable,
			isStabilityVersion: observable,
			attemptOffer: observable,
			isGetConnectionStatusSucceeded: observable,
			errorMessage: observable,
			errorTitle: observable
		})
	}
	componentDidMountAsync = async (setI18n: (val: LanguagesKeys) => void) => {
		this.eventBus.emit({
			analyticsCategory: 'ScreenTransitions',
			...this.moduleAndScreenInfo,
			result: Right(null),
			functionalityName: LaunchScreenEnum.MountScreen,
		})
		setTimeout(async () => {
			await this.loadUserAsync({setI18n})
		}, 2000)
	}


// TODO: Идея, при первом запуске без TerminalId сразу выводить меню разработчика?
	loadUserAsync = async ({setI18n, setCurrentFunction}: loadUserAsyncParams): Promise<Promise<boolean> | void> => {
		if (setCurrentFunction) {
			setCurrentFunction('launchScreenStore > loadUserAsync()')
		}
		const commonI18n = globalContext.preferences.value.i18n.common.value
		const i18nChange = globalContext.preferences.value.i18n.auth.value.changePhoneNumber
		await when(() => this.preferences.lceState !== 'loading')
		this.eventBus.emit({
			analyticsCategory: 'ScreenTransitions',
			...this.moduleAndScreenInfo,
			result: Right(null),
			functionalityName: LaunchScreenEnum.MountScreen,
		})
		if (!this.preferences.language) {
			const bestLanguages = findBestLanguageTag<LanguagesKeys>([
				'en',
				'ru',
			]) ?? { isRTL: false, languageTag: 'ru' }
			// const bestLang = bestLanguages.languageTag //TODO: разработать интефейс для смены языка пока хардкодим на русский
			const bestLang = 'ru'
			setI18n(bestLang)
			this.eventBus.emit({
				analyticsCategory: 'ScreenTransitions',
				...this.moduleAndScreenInfo,
				result: Right(bestLang),
				functionalityName: LaunchScreenEnum.SelectLanguage,
			})
		}
		else {
			setI18n(this.preferences.language ?? 'en')
		}
		if (!this.preferences.isAuthorized) {
			this.eventBus.emit({
				analyticsCategory: 'Errors',
				...this.moduleAndScreenInfo,
				functionalityName: LaunchScreenEnum.UserNotAuth,
				result: Right(null),
			})

			try {
				await this.registerUuidAsync()
				return this.isSucceded
			}
			catch {
				ModalController.showModal({
					title: commonI18n.errors.error,
					description: i18nChange.errors.unexpectedAuthError,
				})
				return this.isSucceded
			}
		}
		if (this.preferences.isAuthorized) {
			this.isSucceded = true

			return this.isSucceded
		}
	}


	private readonly registerUuidAsync = async () => {
		const uuid = this.preferences.uuid || uuidv1();
		const request = generateAuthUuidRequest(
			'RU',
			'RU',
			uuid,
		)
		const authEither = await this.authRepo.registerUuidAsync(request)
		if (authEither.value.isLeft()) {
			console.log('isLEFT:::', authEither.value)
			await this.preferences.setUuid('')
			return authEither.value
		}
		const authResponse = authEither.value.unsafeCoerce()

		const start_key = forge.util.encode64(authResponse.password);
		const startKeyEither = await this.preferences.setStartKey(start_key)
		const uuidEither = await this.preferences.setUuid(uuid)
		await this.authenticateEitherAsync({authResponse, uuid})
		if (startKeyEither.isLeft()) {
			return startKeyEither
		}
		if (uuidEither.isLeft()) {
			return uuidEither
		}

		return Right(this.isSucceded)
	}
	private readonly authenticateEitherAsync = async (
		props: AuthenticateEitherEntity
	) => {

		const request = generateAuthRequest(
			props.uuid,
			props.authResponse.password,
		)
		const authEither = await this.authRepo.authUser(request)
		if (authEither.value.isLeft()) {
			return authEither.value
		}
		const authCredentials = authEither.value.unsafeCoerce()

		const credentialsEither = await this.preferences.setCredentials(authCredentials)
		if (credentialsEither.isLeft()) {
			return credentialsEither
		}
		this.isSucceded = true
		return this.isSucceded
	}

}

