import { BackHandler, LogBox, NativeEventEmitter, View } from 'react-native'
import { i18nProvider, LanguagesKeys } from '../DependencyInjection/i18nProvider'
import React, { useEffect, useState } from 'react'
import { FileLogger } from '../NativeModules/Android/Logger/Logger'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { I18n } from '../I18n/_Logic/I18n'
import { MainNavigator } from './MainNavigator'
import { ModeBadge } from '../Components/_Common/ModeBadge/ModeBadge'
import dayjs from 'dayjs'
import { globalContext } from '../DependencyInjection/AppContext'
import { i18nContext } from './Context/i18nContext'
import { observer } from 'mobx-react'
import { Style as s } from './MainNavigator.Style'
import ModalController from '../Components/_Common/Modal/CustomAlertModalController';
import { HealthDegradedCallbackType } from '../Core/AppHealthProvider/IAppHealthProvider';
import { AppIoCContainer } from '../Infrastructure/Objects/AppIoContainer';
import { ScannerAdapter } from '../Adapter/ScannerAdapter';
import { PaymentServiceAdapter } from '../Adapter/SmartSaleTerminalAdapter';
import { FailureDebugCause, FailureSeverity } from '../Core/connections/MqttClient/IMqttClient';
import {
	generateFailureDebugInfo,
	generateFailureInfoParams,
	getCheckConnectedText,
	registerStatusChangedServiceToRabbitMq,
	sendFailureInfoToRabbitMqAsync,
} from '../Core/connections/MqttClient/MqttClientMessageRouting';
import { shouldPerformCheck } from '../Core/AppHealthProvider/shouldPerformCheck';
import { ApplicationHealthProviderItemName } from '../Infrastructure/Objects/ObjectAvailabilityVerifiers/types';


LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state', 'new NativeEventEmitter',
])
export const AppContainer = observer(() => {
	const [i18n, setI18n] = React.useState<I18n>(globalContext.preferences.value.i18n)
	const appHealthProvider = AppIoCContainer.getAppHealthProvider()
	const scannerAdapter = new ScannerAdapter()
	const paymentService = new PaymentServiceAdapter()
	const eventEmitter = new NativeEventEmitter()
	const [isDegradedHealth, setIsDegradedHealth] = useState(appHealthProvider.isHealthDegraded)
	const [isScannerConnected, setScannerConnected] = useState(false)
	const [isTerminalConnected, setTerminalConnected] = useState(false)
	const getInitialScannerStatus = async() => {
		let status = true
		let errorText = ''
		try {
			status = (await scannerAdapter.getScannerStatus()).unsafeCoerce()
		}catch (e) {
			console.log('Error check scanner initial status:::', e)
			errorText += 'Error check scanner initial status:::' + e
			const debugInfo = generateFailureDebugInfo(Number(status), getCheckConnectedText(status), errorText)
			const failureInfoParams = generateFailureInfoParams(
				debugInfo,
				FailureSeverity.Normal,
				FailureDebugCause.STATUS_BARCODE_SCANNER
			)
			sendFailureInfoToRabbitMqAsync(failureInfoParams)
		}finally {
			const needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isScannerAvailable)
			if (needCheck) {
				appHealthProvider.setScannerAvailability(status)
			}
			setScannerConnected(status)
		}
	}
	const getInitialTerminalStatus = async() => {
		let status = true
		let errorText = ''
		try {
			status = (await paymentService.getTerminalStatus()).unsafeCoerce()
		}catch (e) {
			console.log('Error check terminal initial status:::', e)
			errorText += 'Error check terminal initial status:::' + e
			const debugInfo = generateFailureDebugInfo(Number(status), getCheckConnectedText(status), errorText)
			const failureInfoParams = generateFailureInfoParams(
				debugInfo,
				FailureSeverity.Normal,
				FailureDebugCause.STATUS_POS_TERMINAL
			)
			sendFailureInfoToRabbitMqAsync(failureInfoParams)
		}finally {
			const needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isPosTerminalAvailable)
			if (needCheck) {
				appHealthProvider.setPosTerminalAvailability(status)
			}
			setTerminalConnected(status)
		}
	}
	const showModal = () => {
		const notShowRoutes = globalContext.navigatorRef.value.current && globalContext.navigatorRef.value.current?.getCurrentRoute()
		if(!notShowRoutes) {
			return
		}

		if(appHealthProvider.isHealthDegraded && notShowRoutes &&
			notShowRoutes?.name !== 'engineeringMenu' &&
			notShowRoutes?.name !== 'usbDevicesCheck' &&
			notShowRoutes?.name !== 'authorization' &&
			notShowRoutes?.name !== 'notReady') {
			const notAvailableObjectsMessage = i18n.errorView.value.notReady.ConnectionErrorSubtitlePart + appHealthProvider.getServiceNoConnection().map(item => item).join(', ')
			ModalController.showModal({
				title: i18n.errorView.value.notReady.connectionErrorTitle,
				description:  i18n.errorView.value.notReady.connectionErrorSubtitlePartII,
				subDescription: notAvailableObjectsMessage,
				isConnectionError: true,
			})
		}
	}
	const initListeners = () => {
		getInitialScannerStatus()
		getInitialTerminalStatus()
		BackHandler.addEventListener('hardwareBackPress', () => true)
		eventEmitter.addListener( 'ScannerState', event => {
			if(appHealthProvider.isScannerAvailable !== (event === 'true')) {
				registerStatusChangedServiceToRabbitMq(event === 'true', FailureDebugCause.STATUS_BARCODE_SCANNER)
			}
			const needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isScannerAvailable)
			if (needCheck) {
				appHealthProvider.setScannerAvailability(event === 'true')
			}
			setScannerConnected(event === 'true')
		});

		eventEmitter.addListener('TerminalState', event => {
			if(appHealthProvider.isPosTerminalAvailable !== (event === 'true')) {
				registerStatusChangedServiceToRabbitMq(event === 'true', FailureDebugCause.STATUS_POS_TERMINAL)
			}
			setTerminalConnected(event === 'true')
			const needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isPosTerminalAvailable)
			if (needCheck) {
				appHealthProvider.setPosTerminalAvailability(event === 'true')
			}
		});
		if(appHealthProvider.subscribers) {
			appHealthProvider.subscribers.forEach((subscriber: HealthDegradedCallbackType) => appHealthProvider.unsubscribe(subscriber))
		}
		appHealthProvider.subscribe(showModal)
	}
	const toggleLanguageAsync = async (val: LanguagesKeys) => {
		setI18n(i18nProvider(val))
		dayjs.locale(val)
		await globalContext.preferences.value.setLanguage(val)
	}
	useEffect(() => {
		setIsDegradedHealth(appHealthProvider.isHealthDegraded)
		appHealthProvider.notify()
	}, [appHealthProvider.setScannerAvailability,
		appHealthProvider.isPosTerminalAvailable,
		isTerminalConnected, isScannerConnected,
		appHealthProvider.isAppServerAvailable,
		appHealthProvider.isMqttBrokerAvailable,
		appHealthProvider.isIziPosAvailable,
		appHealthProvider.isPosTerminalLinkWithBankEstablished,
		isDegradedHealth, appHealthProvider.isHealthDegraded,
		paymentService.isChecking
	])


	useEffect(() => {
		initListeners()
		FileLogger.enableConsoleCapture()
		return () => {
			appHealthProvider.unsubscribe(showModal)
			if(appHealthProvider.subscribers) {
				appHealthProvider.subscribers.forEach((subscriber: HealthDegradedCallbackType) => appHealthProvider.unsubscribe(subscriber))
			}
		}
	}, [])

	const isProd = globalContext.preferences.value.environmentVariables.environment === 'prod'
	return (
		<GestureHandlerRootView style={s.flex}>
			<i18nContext.Provider value={{ i18n, toggleLanguageAsync }}>
				<MainNavigator />
				{!isProd && <ModeBadge />}
			</i18nContext.Provider>
			<View style={s.usbDevicesStatusContainer}>
			</View>
	</GestureHandlerRootView>
	)
})
