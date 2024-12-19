import { NativeEventEmitter, SafeAreaView, View } from 'react-native';
import React, { useContext, useState } from 'react';
import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine';
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { BottomComponent } from '../../Components/_Common/Bottom/Bottom';
import { BottomStyles } from '../../Components/_Common/Bottom/Bottom.Styles';
import { Greetings } from './FirstRow/Greetings';
import { MainNavigatorRoutes } from 'EntryPoint/MainNavigator';
import { PaymentServiceAdapter } from '../../Adapter/SmartSaleTerminalAdapter';
import { QrCodeForApp } from './ThirdRow/QrCodeForApp';
import { StackScreenProps } from '@react-navigation/stack';
import { StyledButton } from '../../Components/_Common/Button/StyledButton';
import { UsageGuide } from './SecondRow/UsageGuide';
import { getUnpaidPurchaseAsync } from '../PurchaseInit/PurchaseInit.Store';
import { InitialPurchaseStyles as s } from './InitialPurcahses.Styles';
import { useFocusEffect } from '@react-navigation/native';
import { useI18n } from '../../EntryPoint/Context/i18nContext';
import { useEmergencyReturn } from '../../Infrastructure/EmergencyReturn';
import { AppIoCContainer } from '../../Infrastructure/Objects/AppIoContainer';
import { RemoteCommandEnum } from '../../Core/connections/MqttClient/IMqttClient';
import { restartPosTerminalAsync } from '../../Infrastructure/Objects/RemoteCommandProvider/RestartPosTerminal';

export type InitialPurchaseProps = StackScreenProps<
  MainNavigatorRoutes,
  'initialPurchase'
>;

export const InitialPurchase = (props: InitialPurchaseProps) =>  {
  const i18n = useI18n().i18n
  const [state, send] = useContext(AppFlowMachineContext)
  const paymentService = new PaymentServiceAdapter()
  const appHealthProvider = AppIoCContainer.getAppHealthProvider()
  const posTerminalLinkWithBankErrorProvider = AppIoCContainer.getPosTerminalLinkWithBankErrorProvider()
  const eventEmitter = new NativeEventEmitter()
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  const remoteCommandProvider = AppIoCContainer.getRemoteCommandProvider()
  const setCurrentFunction = useEmergencyReturn(AppFlowStates.PurchaseInvitation, 0)
  const isAvailableToStartReconciliationOfTotals = appHealthProvider.isPosTerminalAvailable &&
                                                            appHealthProvider.isPosTerminalLinkWithBankEstablished &&
                                                            appHealthProvider.isAppServerAvailable

  const beginReconciliate = async () => {
    const currentState = state.value
    if (currentState === AppFlowStates.PurchaseInvitation && isAvailableToStartReconciliationOfTotals) {
        send(AppFlowEvents.START_PAYMENT_RECONCILIATION)
    }
    else {
      await paymentService.beginReconciliateOfTotals(false)
    }
  }

  const userHaveUnpaidCheckAsync = async () => {
    setIsBtnDisabled(true)
    setCurrentFunction('')
    const response = await getUnpaidPurchaseAsync()
    if (response !== null) {
      send({type: AppFlowEvents.START_PURCHASE, check: response})
    }
    else {
      setIsBtnDisabled(false)
    }

  }
    const handleRemoteCommandReconciliationOfTotals = (data: any) => {
        if (data && data.event === RemoteCommandEnum.MAKE_RECONCILIATION_OF_TOTALS) {
            if(data.success) {
                send({ type: AppFlowEvents.START_PAYMENT_RECONCILIATION, isManualROT: true})
            }
        }
    }

    const handleRemoteCommandRestartPosTerminal = async (data: any) => {
        if (data && data.event === RemoteCommandEnum.RESTART_POS_TERMINAL) {
            if(data.success) {
                await restartPosTerminalAsync()
            }
        }
    }
    useFocusEffect(
      React.useCallback(() => {
        posTerminalLinkWithBankErrorProvider.cleanConnectionErrorCount()
        eventEmitter.removeAllListeners('ROTOnBegin')
        appHealthProvider.notify()
        userHaveUnpaidCheckAsync()
        remoteCommandProvider.subscribe(handleRemoteCommandReconciliationOfTotals)
        remoteCommandProvider.subscribe(handleRemoteCommandRestartPosTerminal)
        const rotListener = eventEmitter.addListener('ROTOnBegin', (event) => {
          beginReconciliate()
          console.log('ROTOnBegin::', event)
        });
        return () => {
          console.log('unsubsInitPurchase:::')
          rotListener.remove()
          remoteCommandProvider.unsubscribe(handleRemoteCommandReconciliationOfTotals)
          remoteCommandProvider.unsubscribe(handleRemoteCommandRestartPosTerminal)
        }
      }, [])
    );
    return (
      <SafeAreaView style={s.wrap}>
        <View style={s.container}>
          <Greetings {...props}/>
          <UsageGuide />
          <QrCodeForApp />
        </View>
        <BottomComponent>
        <StyledButton
            title={i18n.common.value.buttons.start}
            buttonStyle={BottomStyles.activeButton}
            textStyle={BottomStyles.textStyle}
            disabled={isBtnDisabled}
            onPress={() => send(AppFlowEvents.START_PURCHASE)}
            />
        </BottomComponent>
      </SafeAreaView>
    );
}
