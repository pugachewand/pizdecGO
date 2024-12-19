import { View } from 'react-native'
import React, { useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AppFlowEvents from '../../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../../Machines/AppFlow/AppFlowMachine';
import { DotLoaders } from '../../_Common/Loaders/DotLoaders';
import { LaunchScreenStore } from './LaunchScreen.Store'
import { MainNavigatorRoutes } from '../../../EntryPoint/MainNavigator'
import { ReconciliationEmitter } from '../../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { StackScreenProps } from '@react-navigation/stack'
import { i18nContext } from '../../../EntryPoint/Context/i18nContext';
import { LaunchScreenStyles as s } from './LaunchScreen.Styles'
import { useEmergencyReturn } from '../../../Infrastructure/EmergencyReturn';
import AppFlowStates from '../../../Machines/AppFlow/AppFlowStates';
import {
	generateFailureDebugInfo,
	generateFailureInfoParams, sendFailureInfoToRabbitMqAsync
} from '../../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity } from '../../../Core/connections/MqttClient/IMqttClient';
import { AppIoCContainer } from '../../../Infrastructure/Objects/AppIoContainer';
import { globalContext } from '../../../DependencyInjection/AppContext';
import { MqttClientConnection } from '../../../Core/connections/MqttClient/MqttClientConnection';

export type LaunchScreenProps = StackScreenProps<MainNavigatorRoutes, 'authorization'>

export const LaunchScreenNavigatorRoot = (props: LaunchScreenProps) => {
	const launchScreenStore = new LaunchScreenStore(props)
	const reconciliationEmitter = new ReconciliationEmitter()
	const [state, send] = useContext(AppFlowMachineContext)
	const context = useContext(i18nContext)
	const setCurrentFunction = useEmergencyReturn(AppFlowStates.Init)
	const setI18n = context.toggleLanguageAsync
	const mqttClientConnection = new MqttClientConnection()
	const mqttClient = AppIoCContainer.getMqttClient()

	const initialLaunchNavigateAsync = async () => {
		let failureInfoParams
		let debugInfo
		const result = await launchScreenStore.loadUserAsync({setI18n, setCurrentFunction})
		console.log('result isAuthorized:::', result)
		if(!mqttClient.isConnected) {
			try {
				await mqttClientConnection.connectToRabbitMqAsync()
				debugInfo = generateFailureDebugInfo(0, 'Initialized app', '')
				failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, FailureDebugCause.INITIATE_APP)
			}
			catch (e) {
				console.log('Error ', e)
				debugInfo = generateFailureDebugInfo(1, '', 'Error ' + e)
				failureInfoParams = generateFailureInfoParams(
					debugInfo,
					FailureSeverity.Normal,
					FailureDebugCause.STATUS_MQTT_CONNECTION
				)
				send({
				    type: AppFlowEvents.ERROR,
				    errorTitle: globalContext.preferences.value.i18n.errorView.value.notReady.errorTitle,
				    errorMessage: globalContext.preferences.value.i18n.errorView.value.notReady.errorGetPosSettingsDescription,
				})
			}
			await sendFailureInfoToRabbitMqAsync(failureInfoParams)

		}

		if (result && launchScreenStore.isSucceded ) {
			send(AppFlowEvents.SUCCESS)
		}
		else {
			send(AppFlowEvents.ERROR)
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			setCurrentFunction('')
			reconciliationEmitter.subscribe(false)
			initialLaunchNavigateAsync()
			return () => {
				reconciliationEmitter.unsubscribe()
				setCurrentFunction('')
			}
		}, [])
	);

	return (
		<View style={s.mainContainer}>
			<View style={[s.container, s.loaderContainer]}>
				<DotLoaders accentColor={true}/>
			</View>
		</View>
	)
};
