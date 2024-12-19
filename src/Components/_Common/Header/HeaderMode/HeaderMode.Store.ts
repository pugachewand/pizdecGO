import { AppEnvironment, appEnvironmentValues } from '../../../../Infrastructure/Auth/BackendMode'
import { Either, Right } from 'purify-ts/Either'
import { HeaderModeEnum, InputName } from './HeaderModeEnum'
import { action, makeObservable, observable } from 'mobx'
import { CounterInteractor } from '../../../../Logic/Interactors/CounterInteractor'
import { PaymentServiceAdapter } from '../../../../Adapter/SmartSaleTerminalAdapter';
import { globalContext } from '../../../../DependencyInjection/AppContext'
import AppFlowStates from '../../../../Machines/AppFlow/AppFlowStates'

export type AlertButton = { name: string; onPress: () => void }

export type AlertInput = {
	nameInput: string
	text?: string
	hint: string
	onChange: (value: string) => void
}

export type Alert = {
	title: string
	buttons: AlertButton[]
	inputs: AlertInput[]
	additionalFunction?: () => void;
}

export class HeaderModeStore {

	private static readonly requiredNumberOfTapsToShowHiddenModal = 5

	private readonly preferences = globalContext.preferences.value
	private readonly navigator = globalContext.navigatorRef.value.current
	private readonly eventBus = globalContext.eventBus.value
	private paymentService = new PaymentServiceAdapter()

	alert?: Alert = undefined

	customBackendAddress = this.preferences.customBackendAddress || ''
	paymentReconciliationDate = this.preferences.paymentReconciliationDate || ''
	paymentReconciliationFrequency = this.preferences.paymentReconciliationFrequency || ''
	terminalId = this.preferences.terminalId || ''
	posToken = this.preferences.posToken || ''

	private readonly moduleAndHeaderInfo = {
		moduleName: HeaderModeEnum.Module,
		screenName: HeaderModeEnum.ModeSelection,
	}
	private i18n = globalContext.preferences.value.i18n.welcome.value

	private readonly customBackendAddressAlertInput: AlertInput = {
		nameInput: InputName.CustomBackendAddress,
		hint: this.i18n.mode.customBackendAddress,
		text: this.customBackendAddress,
		onChange: value => this.setCustomBackendAddress(value),
	}

	private readonly paymentReconciliationDateAlertInput: AlertInput = {
		nameInput: InputName.PaymentReconciliationDate,
		hint: this.i18n.mode.paymentReconciliationDate,
		text: this.paymentReconciliationDate,
		onChange: value => this.setPaymentReconciliationDate(value),
	}
	private readonly paymentReconciliationFrequencyAlertInput: AlertInput = {
		nameInput: InputName.PaymentReconciliationFrequency,
		hint: this.i18n.mode.paymentReconciliationFrequency,
		text: this.paymentReconciliationFrequency,
		onChange: value => this.setPaymentReconciliationFrequency(value),
	}

	private readonly terminalIdAlertInput: AlertInput = {
		nameInput: InputName.TerminalID,
		hint: this.i18n.mode.terminalId,
		text: (globalContext.preferences.value.terminalId || ''),
		onChange: value => this.setTerminalId(value),
	}

	private readonly posTokenAlertInput: AlertInput = {
		nameInput: InputName.PosToken,
		hint: this.i18n.mode.posToken,
		text: (globalContext.preferences.value.posToken || ''),
		onChange: value => this.setPosToken(value),
	}

	private buttons: AlertButton[] = appEnvironmentValues
	.map(mode => ({
		name: this.i18n.mode.name(mode),
		onPress: async () => {
			await this.onModeSelectedAsync({
				environment: mode,
				customBackendAddress: this.customBackendAddress,
				posToken: this.posToken,
				paymentReconciliationDate: this.paymentReconciliationDate,
				paymentReconciliationFrequency: this.paymentReconciliationFrequency,
				terminalId: this.terminalId,
			})

			this.eventBus.emit({
				analyticsCategory: 'Click',
				...this.moduleAndHeaderInfo,
				functionalityName: HeaderModeEnum.ModeChangeClick,
				result: Right(null),
				eventData: { environment: mode },
			})
		},
	}))

	wasTerminalIdRotDataChanged = () => {
		if (this.terminalId !== this.preferences.terminalId
		|| this.paymentReconciliationDate !== this.preferences.paymentReconciliationDate
		|| this.paymentReconciliationFrequency !== this.preferences.paymentReconciliationFrequency
		) {
			console.log('changed::: ', true)
			return true
		}
		else {
			console.log('changed::: ', false)
			return false
		}
	}

	private readonly counterInteractor = new CounterInteractor(HeaderModeStore.requiredNumberOfTapsToShowHiddenModal, () => {
		const i18n = globalContext.preferences.value.i18n.welcome.value
		const commonI18n = globalContext.preferences.value.i18n.common.value
		const extendedButtons = this.buttons.concat({
			name: commonI18n.buttons.cancel,
			onPress: () => {
				this.setAlert()
				this.eventBus.emit({
					analyticsCategory: 'Click',
					...this.moduleAndHeaderInfo,
					functionalityName: HeaderModeEnum.ModeChangeClick,
					result: Right(null),
					eventData: { environment: HeaderModeEnum.CancelClick },
				})
			},
		})
		this.setAlert({
			title: i18n.mode.selectBackendMode,
			buttons: extendedButtons,
			inputs: [this.customBackendAddressAlertInput, this.posTokenAlertInput, this.paymentReconciliationDateAlertInput, this.paymentReconciliationFrequencyAlertInput, this.terminalIdAlertInput],
		})
	})

	constructor() {
		makeObservable(this, {
			alert: observable,
			customBackendAddress: observable,
			paymentReconciliationDate: observable,
			paymentReconciliationFrequency: observable,
			terminalId: observable,
			posToken: observable,
			setAlert: action,
			setCustomBackendAddress: action,
			setPaymentReconciliationDate: action,
			setPaymentReconciliationFrequency: action,
			setTerminalId: action,
			setPosToken: action,
		})

		if (globalContext.navigatorRef.value.current?.getCurrentRoute()?.name === AppFlowStates.EngineeringMenu) {
			this.setAlertForEngMenu()
		}
	}

	setAlertForEngMenu = () => {
		this.setAlert({
			title: this.i18n.mode.selectBackendMode,
			buttons: this.buttons,
			inputs: [this.customBackendAddressAlertInput, this.posTokenAlertInput, this.paymentReconciliationDateAlertInput, this.paymentReconciliationFrequencyAlertInput, this.terminalIdAlertInput]})
	}

	setAlert = (alert?: Alert) => {
		this.alert = alert
	}
	startReconcilation = () => {
		this.paymentService.reconciliateOfTotals()
	}

	setCustomBackendAddress = (customBackendAddress: string) => {
		this.customBackendAddress = customBackendAddress
	}


	setPosToken = (token: string) => {
		this.posToken = token
	}

	setTerminalId = (ID: string) => {
		this.terminalId = ID
	}

	setPaymentReconciliationDate = (date: string) => {
		this.paymentReconciliationDate = date
	}
	setPaymentReconciliationFrequency = (frequency: string) => {
		this.paymentReconciliationFrequency = frequency
	}

	onModeSelectedAsync = async (props: { environment: AppEnvironment, customBackendAddress: string, posToken: string, paymentReconciliationDate: string, paymentReconciliationFrequency: string, terminalId: string }) => {
		const oldEnv = this.preferences.appEnvironment
		const isTerminalDataChanged = this.wasTerminalIdRotDataChanged()
		const eithers = [
			await this.preferences.setAppEnvironment(props.environment),
			await this.preferences.setCustomBackendAddress(props.customBackendAddress),
			await this.preferences.setPosToken(props.posToken),
			await this.preferences.setPaymentReconciliationDate(props.paymentReconciliationDate),
			await this.preferences.setPaymentReconciliationFrequency(props.paymentReconciliationFrequency),
			await this.preferences.setTerminalId(props.terminalId),
		]

		const firstLeft = Either.lefts(eithers).find(_ => true)
		if (firstLeft) {
			return firstLeft
		}
		if (oldEnv !== props.environment) {
			await this.preferences.forgetCredentials()
		}

		if (globalContext.navigatorRef.value.current?.getCurrentRoute()?.name !== AppFlowStates.EngineeringMenu) {
			this.setAlert()
		}
		if (this.navigator) {
			if (isTerminalDataChanged) {
				this.navigator.navigate('usbDevicesCheck')
				return
			}
			if (this.navigator.getCurrentRoute()?.name !== AppFlowStates.EngineeringMenu) {
				this.navigator.navigate('authorization')
			}
		}

		return Right(null)
	}
	secretButtonOnPress = () => {
		this.counterInteractor.onCount()
		if (this.alert) {
			this.eventBus.emit({
				analyticsCategory: 'Click',
				...this.moduleAndHeaderInfo,
				functionalityName: HeaderModeEnum.ClickOnSecretMode,
				result: Right(null),
			})
		}
	}
}
