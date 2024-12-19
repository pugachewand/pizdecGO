import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NativeEventEmitter, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import AppFlowEvents from '../../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../../Machines/AppFlow/AppFlowMachine';
import { DotLoaders } from '../../_Common/Loaders/DotLoaders';
import {MainNavigatorRoutes} from 'EntryPoint/MainNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import { globalContext } from '../../../DependencyInjection/AppContext';
import { LaunchScreenStyles as s } from '../LaunchScreen/LaunchScreen.Styles';
import { HeaderMode } from '../../../Components/_Common/Header/HeaderMode/HeaderMode';
import {
    generateFailureDebugInfo,
    generateFailureInfoParams,
    sendFailureInfoToRabbitMqAsync,
    sendInfoToRabbitMqAsync
} from '../../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity } from '../../../Core/connections/MqttClient/IMqttClient';
import { AppIoCContainer } from '../../../Infrastructure/Objects/AppIoContainer';
import { ObjectAvailabilityCheckerHandler } from '../../../Infrastructure/Objects/ObjectAvailabilityCheckerHandler';
import useIntervalCheck from '../../../Infrastructure/Objects/ObjectAvailabilityCheckerHandler/useIntervalCheck';
import { MqttClientConnection } from '../../../Core/connections/MqttClient/MqttClientConnection';

export type EngineeringMenuProps = StackScreenProps<
  MainNavigatorRoutes,
  'engineeringMenu'
>;

export const EngineeringMenu = (props: EngineeringMenuProps) =>  {
    const [state, send] = useContext(AppFlowMachineContext)
    const [showMenu, setShowMenu] = useState(false)
    const mqttClientConnection = new MqttClientConnection()
    const mqttClient = AppIoCContainer.getMqttClient()
    const appSettings = AppIoCContainer.getAppSettings()
    const eventEmitter = new NativeEventEmitter()
    let failureInfoParams
    let debugInfo
    const connectToRabbitMq = async () => {
        try {
            const isConnected = await mqttClientConnection.connectToRabbitMqAsync()
            debugInfo = generateFailureDebugInfo(0, 'Initialized app', '')
            failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, FailureDebugCause.INITIATE_APP)
            await sendFailureInfoToRabbitMqAsync(failureInfoParams)

            return isConnected
        }
        catch (e) {
            console.log('Error ', e)
            debugInfo = generateFailureDebugInfo(1, '', 'Error ' + e)
            failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Normal,
                FailureDebugCause.STATUS_MQTT_CONNECTION
            )
            await sendFailureInfoToRabbitMqAsync(failureInfoParams)

            return false
        }
    }
    const checkObjectsAvailabilityCallback = useCallback(() => {
        const objectAvailabilityCheckerHandler = new ObjectAvailabilityCheckerHandler()
        objectAvailabilityCheckerHandler.healthProviderItemAvailabilitySetStatusAsync()
    }, [])
    useIntervalCheck(checkObjectsAvailabilityCallback)
    const doWeHaveQrCodeAndTerminalId = () => {
        return !!globalContext.preferences.value.terminalId && !!globalContext.preferences.value.posToken
    }
    const [update, setUpdate] = useState(false)
    useEffect(() => {
        const heartBeatListener = eventEmitter.addListener('onHeartbeatTick', async (event) => {
            try {
                await sendInfoToRabbitMqAsync()
            }catch (e) {
                console.log('Error send to Rabbit:::', e)
            }finally {
                console.log('heartBeat ====>', event)
            }
        });
        return () => {
            heartBeatListener.remove()
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                if (doWeHaveQrCodeAndTerminalId()) {
                    if(!mqttClient.isConnected && appSettings.posId === 0 ) {
                        connectToRabbitMq().then(() => {
                            send(AppFlowEvents.SUCCESS)
                        })
                    }else {
                        send(AppFlowEvents.SUCCESS)
                    }
                }
                else {
                    setShowMenu(true)
                }
            }, 500)
        }, [update, state.event.isPosTokenNotValid])
    )
    return (
        <View style={s.mainContainer}>
            <View style={[s.container, s.loaderContainer]}>
                <DotLoaders accentColor={true}/>
                {showMenu && <HeaderMode children={''} additionalFunc={() => setUpdate(!update)} isPosTokenNotValid={state.event.isPosTokenNotValid}/>}
            </View>
        </View>
    )
}
