import { EnvironmentVariables, betaConstants, prodConstants } from '../Constants'
import {
	IAuthPreferencesFactory,
	IPreferences,
	IPreferencesFactory,
} from './Preferences.Type'
import { LanguagesKeys, i18nProvider } from '../i18nProvider'
import { action, computed, configure, makeObservable, observable, runInAction } from 'mobx'

import { AppEnvironment } from '../../Infrastructure/Auth/BackendMode'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Lce } from '../../Infrastructure/Lce'
import { RefreshTokenResponseEntity } from '../../Logic/RestApi/Auth/AuthRepo.Types'
import { Right } from 'purify-ts/Either'
import { UserCredentials } from '../../Infrastructure/Auth/UserCredentials'
import dayjs from 'dayjs'

export class PreferencesStore implements IPreferences {
	private static readonly secondsReserveTillTokenExpire = 60
	private readonly preferencesFactory: IPreferencesFactory
	private readonly authFactory: IAuthPreferencesFactory
	// #region state
	lceState: Lce = 'loading'

	isAppMetricaActivated = false

	appEnvironment: AppEnvironment = 'prod'

	customBackendAddress: string | null = null

	qrCodeShowcase: string | null = null

	posToken: string | null = ''

	paymentReconciliationDate: string | null = null

	paymentReconciliationFrequency: string | null = null

	appStartDate: string | null = null

	terminalId: string | null = null

	startKey: string | null = null

	uuid: string | null = null

	credentials: UserCredentials | null = null

	language: LanguagesKeys | null = null

	// #endregion


	constructor(
		preferencesFactory: IPreferencesFactory,
		authFactory: IAuthPreferencesFactory,
	) {
		configure({
			useProxies: 'never',
		})
		this.preferencesFactory = preferencesFactory
		this.authFactory = authFactory
		makeObservable(this, {
			lceState: observable,
			appEnvironment: observable,
			customBackendAddress: observable,
			credentials: observable,
			startKey: observable,
			uuid: observable,
			environmentVariables: computed,
			isAuthorized: computed,
			setAppEnvironment: action,
			setCustomBackendAddress: action,
			setQrCodeShowcase: action,
			setPosToken: action,
			setTerminalId: action,
			setCredentials: action,
			setStartKey: action,
			setUuid: action,
			forgetCredentials: action,
			language: observable,

		})
		this.fetchValuesAsync()
	}

	get i18n() {
		return i18nProvider(this.language)
	}
	// #endregion


	get environmentVariables() {
		switch (this.appEnvironment) {
			case 'prod': return prodConstants
			case 'beta': return betaConstants
			case 'development': return this.developmentConstants()
		}
	}

	get isAuthorized() {
		return this.credentials !== null
	}

	setStartKey = (key: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setStartKey(key))
		.map(_ => {
			this.changeStartKey(key)
		})
		.run()

	setUuid = (uuid: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setUuid(uuid))
		.map(_ => {
			this.changeUuid(uuid)
		})
		.run()

	setLanguage = (lng: LanguagesKeys) =>
		EitherAsync.fromPromise(() => this.preferencesFactory.setLanguage(lng))
		.map(_ => {
			dayjs.locale(lng)
			this.changeLanguage(lng)
		}).run()

	setAppEnvironment = (value: AppEnvironment) => EitherAsync.fromPromise(() => this.preferencesFactory.setEnvironment(value))
		.map(_ => {
			this.changeAppEnvironment(value)
		})
		.run()

	setCustomBackendAddress = (value: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setCustomBackendAddress(value))
		.map(_ => {
			this.changeCustomBackendAddress(value)
		})
		.run()

	setQrCodeShowcase = (value: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setQrCodeShowcase(value))
	.map(_ => {
		this.changeQrCodeShowcase(value)
	})
	.run()

	setPosToken = (value: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setPosToken(value))
	.map(_ => {
		this.changePosToken(value)
	})
	.run()

	setPaymentReconciliationDate = (value: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setPaymentReconciliationDate(value))
	.map(_ => {
		this.changePaymentReconciliationDate(value)
	})
	.run()

	setPaymentReconciliationFrequency = (value: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setPaymentReconciliationFrequency(value))
	.map(_ => {
		this.changePaymentReconciliationFrequency(value)
	})
	.run()

	setAppStartDate = (value: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setAppStartDate(value))
	.map(_ => {
		this.changeAppStartDate(value)
	})
	.run()

	setTerminalId = (value: string) => EitherAsync.fromPromise(() => this.preferencesFactory.setTerminalId(value))
	.map(_ => {
		console.log('NEWWWWWWWWWW TERMIANL ID::: ', value)
		this.changeTerminalId(value)
	})
	.run()

	setCredentials = (value: RefreshTokenResponseEntity) => {

		const userCreds = {
			authToken: value.access_token,
			refreshToken: value.refresh_token,
			authTokenExpireDate: dayjs().add(value.expires_in - PreferencesStore.secondsReserveTillTokenExpire, 'second').toDate(),
			scope: value.scope,
		}

		return EitherAsync.fromPromise(() => this.authFactory.setCredentials(userCreds))
			.map(result => {
				this.changeCredentials(userCreds)
				return result
			}).run()
	}
	forgetCredentials = () => EitherAsync.fromPromise(() => this.authFactory.setCredentials(null))
		.map(result => {
			this.changeCredentials(null)
			return result
		}).run()

	private readonly changeLanguage = (lng: LanguagesKeys | null) => {
			runInAction(() => {
				this.language = lng
			})
		}
	private readonly changeAppEnvironment = (value: AppEnvironment) => {
		runInAction(() => {
			this.appEnvironment = value
		})
	}

	private readonly changeCustomBackendAddress = (value: string | null) => {
		runInAction(() => {
			this.customBackendAddress = value
		})
	}

	private readonly changeQrCodeShowcase = (value: string | null) => {
		runInAction(() => {
			this.qrCodeShowcase = value
		})
	}

	private readonly changePosToken = (value: string | null) => {
		runInAction(() => {
			this.posToken = value
		})
	}
	private readonly changePaymentReconciliationDate = (value: string | null) => {
		runInAction(() => {
			this.paymentReconciliationDate = value
		})
	}
	private readonly changePaymentReconciliationFrequency = (value: string | null) => {
		runInAction(() => {
			this.paymentReconciliationFrequency = value
		})
	}
	private readonly changeAppStartDate = (value: string | null) => {
		runInAction(() => {
			this.appStartDate = value
		})
	}

	private readonly changeTerminalId= (value: string | null) => {
		runInAction(() => {
			this.terminalId = value
		})
	}

	private readonly changeCredentials = (value: UserCredentials | null) => {
		runInAction(() => {
			this.credentials = value
		})
	}
	private readonly changeStartKey = (value: string | null) => {
		runInAction(() => {
			this.startKey = value
		})
	}

	private readonly changeUuid = (value: string | null) => {
		runInAction(() => {
			this.uuid = value
		})
	}

	private readonly fetchValuesAsync = async () => {
		//app env
		const appEnvEither = await this.preferencesFactory.getAppEnvironment()
		if (appEnvEither.isLeft()) {
			return appEnvEither
		}
		this.changeAppEnvironment(appEnvEither.unsafeCoerce() || 'prod')
		// backend address
		const customBackendInfoEither = await this.preferencesFactory.getCustomBackendAddress()
		if (customBackendInfoEither.isLeft()) {
			return customBackendInfoEither
		}
		this.changeCustomBackendAddress(customBackendInfoEither.unsafeCoerce())


		const qrCodeInfoEither = await this.preferencesFactory.getQrCodeShowcase()
		if (qrCodeInfoEither.isLeft()) {
			return qrCodeInfoEither
		}
		this.changeQrCodeShowcase(qrCodeInfoEither.unsafeCoerce())

		const posTokenEither = await this.preferencesFactory.getPosToken()
		if (posTokenEither.isLeft()) {
			return posTokenEither
		}
		this.changePosToken(posTokenEither.unsafeCoerce())

		const paymentReconciliationDateEither = await this.preferencesFactory.getPaymentReconciliationDate()
		if (paymentReconciliationDateEither.isLeft()) {
			return paymentReconciliationDateEither
		}
		this.changePaymentReconciliationDate(paymentReconciliationDateEither.unsafeCoerce())

		const paymentReconciliationFrequencyEither = await this.preferencesFactory.getPaymentReconciliationFrequency()
		if (paymentReconciliationFrequencyEither.isLeft()) {
			return paymentReconciliationFrequencyEither
		}
		this.changePaymentReconciliationFrequency(paymentReconciliationFrequencyEither.unsafeCoerce())

		const appStartDateEither = await this.preferencesFactory.getAppStartDate()
		if (appStartDateEither.isLeft()) {
			return appStartDateEither
		}
		this.changeAppStartDate(appStartDateEither.unsafeCoerce())

		const terminalIdEither = await this.preferencesFactory.getTerminalId()
		if (terminalIdEither.isLeft()) {
			return terminalIdEither
		}
		this.changeTerminalId(terminalIdEither.unsafeCoerce())
		// creds
		const credentialsEither = await this.authFactory.getCredentials()
		if (credentialsEither.isLeft()) {
			return credentialsEither
		}
		this.changeCredentials(credentialsEither.unsafeCoerce())
		runInAction(() => {
			this.lceState = 'content'
		})
		// start key
		const startKeyEither = await this.preferencesFactory.getStartKey()
		if (startKeyEither.isLeft()) {
			return startKeyEither
		}
		this.changeStartKey(startKeyEither.unsafeCoerce())
		// uuid
		const uuidEither = await this.preferencesFactory.getUuid()
		if (uuidEither.isLeft()) {
			return uuidEither
		}
		this.changeUuid(uuidEither.unsafeCoerce())

		return Right(undefined)
	}

	private readonly developmentConstants = (): EnvironmentVariables => ({
		environment: 'development',
		publishableKey: 'pk_test_51L0jyFFtKshfJlzHYYaZj26WenqJOzZ32EK7mxDFZp4MIAks7dAnmHzzlDAupDE1L6G40cQR5gOWlGbgLQRbxCLN00rovKOshm',
		apiUrl: this.customBackendAddress || '',
		appTitle: 'EZ Dev',
	})
}
