import React, { useContext, useEffect, useState } from 'react';
import {SafeAreaView, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine';
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { AutoCloseTimer } from '../../Components/_Common/Timer/AutoCloseTimer';
import { BottomStyles } from '../../Components/_Common/Bottom/Bottom.Styles';
import { CartHeader } from './CartHeader/CartHeader';
import Config from 'react-native-config';
import { ItemsTable } from './ItemsTable/ItemsTable';
import { MainNavigatorRoutes } from 'EntryPoint/MainNavigator';
import { ModalButtonProps } from 'Components/_Common/Modal/Modal';
import { Prices } from './Prices/Prices';
import { QuestionIcon } from './Icons/Question.Icon';
import { ReconciliationEmitter } from '../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { StackScreenProps } from '@react-navigation/stack';
import { StyledButton } from '../../Components/_Common/Button/StyledButton';
import { cancelPurchaseAsync } from '../PurchaseCancel/PurchaseCancel.Store';
import { getTotalSum } from './ItemsTable/ItemsTable.Store';
import { globalContext } from '../../DependencyInjection/AppContext';
import { cartStyles as s } from './Carts.Styles';
import { useEmergencyReturn } from '../../Infrastructure/EmergencyReturn';
import { EmergencyReturnTimerEnum } from '../../Infrastructure/EmergencyReturn/EmergencyReturnTypes';
import { useI18n } from '../../EntryPoint/Context/i18nContext';
import { AppHealthProvider } from '../../Infrastructure/Objects/AppHealthProvider';
import { AppIoCContainer } from '../../Infrastructure/Objects/AppIoContainer';

export type cartProps = StackScreenProps<
  MainNavigatorRoutes,
  'cart'
>;
//TODO: таймер для удаления открытого чека после 10сек неиспользования приложения
export const Cart = (props: cartProps) => {
  const appHealthProvider = AppIoCContainer.getAppHealthProvider()
  const commonI18n = useI18n().i18n.common.value
  const cartI18n = useI18n().i18n.cart.value
  const setCurrentFunction = useEmergencyReturn(AppFlowStates.BasketFormation, EmergencyReturnTimerEnum.BasketFormation)
  const reconciliationEmitter = new ReconciliationEmitter()
  const [state, send] = useContext(AppFlowMachineContext)
  const [timer, setTimer] = useState(0)
  const [isCancelPurchase, setIsCancelPurchase] = useState(false)
  const [isHealthDegraded, setHealthDegraded] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isCancelPurchaseLoading, setCancelPurchaseLoading] = useState(false)
  const cancelPurchaseClosingTime = 10
  const modalAutoCloseButton: ModalButtonProps[] = []
  const inActiveTime = Number(Config.INACTIVITY_TIMER) || 30
  const closingTime = Number(Config.CLOSING_TIMER) || 20
  const isDisabledPayButton = getTotalSum(state.context.PurchaseContext.items) === 0 || isLoading || isHealthDegraded
  const modalCancelPurchaseButtons = [
    {name: commonI18n.buttons.dontCancel, onPress: () => setIsCancelPurchase(false), accent: false},
    {name: commonI18n.buttons.cancelPurchase, onPress: () => cancelPurchaseHandleAsync(), accent: true},
  ]

  const cancelPurchaseHandleAsync = async () => {
    setCancelPurchaseLoading(true)
    setCurrentFunction('Cart > cancelPurchaseHandleAsync()')
    const result = await cancelPurchaseAsync(
      state.context.PurchaseContext.init.posOperationId,
    )
   setCancelPurchaseLoading(false)
    if (result) {
      send(AppFlowEvents.CANCEL)
    }
    return
  }

  const autoCloseAsync = async () => {
    setIsCancelPurchase(false)
    if (state.value !== AppFlowStates.BasketFormation) {
      return
    }
    await cancelPurchaseHandleAsync()
  }

  const checkScannerAsync = async () => {
    setCurrentFunction('Cart > checkScannerAsync()')
    const appHealthProvider = new AppHealthProvider(AppIoCContainer.getLogger())
	const errorViewI18n = globalContext.preferences.value.i18n.errorView.value

    const isScannerConnected = appHealthProvider.isScannerAvailable
    if (!isScannerConnected && Config.CHECK_DEVICES_ON_INITIALIZATION === 'true' && Config.DEBUG_MODE !== 'true') {
      send({
        type: AppFlowEvents.ERROR,
        errorTitle: errorViewI18n.notReady.scannerConnectionErrorTitle,
        errorMessage: errorViewI18n.notReady.scannerConnectionErrorDescription
      })
    }
    return isScannerConnected
  }

  useEffect(() => {
    const handleHealthChange = (newHealthStatus: boolean) => {
      setHealthDegraded(newHealthStatus)
    }

    appHealthProvider.subscribe(handleHealthChange)

    return () => {
      appHealthProvider.unsubscribe(handleHealthChange)
    }
  }, [appHealthProvider])

  useFocusEffect(
    React.useCallback(() => {
      console.log('subs', state.value)
      setCurrentFunction('')
      checkScannerAsync()
      reconciliationEmitter.subscribe(false)
      return () => {
        console.log('unsubsCart', state.value)
        reconciliationEmitter.unsubscribe()
        setCurrentFunction('')
      }
    }, [])
  );

  useEffect(() => {
    setTimer((prevTimer) => prevTimer + 1)
  }, [state.context.PurchaseContext.items, isCancelPurchase])

  return (
    <>
      <SafeAreaView style={s.wrap}>
        <View style={s.container}>
          <CartHeader />
          <ItemsTable setItemLoading={setLoading} isItemLoading={isLoading}/>
          {state.context.PurchaseContext.items.length > 0 && <Prices />}
        </View>

        <View style={[BottomStyles.container, BottomStyles.containerSpaceBetween]}>
          <StyledButton
            title={commonI18n.buttons.cancel}
            buttonStyle={BottomStyles.secondaryButton}
            textStyle={BottomStyles.textStyleSecondary}
            onPress={() => setIsCancelPurchase(true)}
          />
          <StyledButton
            title={commonI18n.buttons.pay}
            disabled={isDisabledPayButton}
            buttonStyle={isDisabledPayButton ? BottomStyles.disabledButton : BottomStyles.activeButton}
            textStyle={isDisabledPayButton ? BottomStyles.disabledTextStyle : BottomStyles.textStyle}
            onPress={
              () =>  {
                state.value == AppFlowStates.BasketFormation && send(AppFlowEvents.START_PAYMENT)
              }
          }
          />
        </View>
        {!isHealthDegraded && !isLoading && <AutoCloseTimer
          timerKey={timer}
          timerSize={100}
          headerIcon={<QuestionIcon/>}
          headerText={cartI18n.autoClose.headerText}
          contentHeaderText={cartI18n.autoClose.contentHeaderText}
          contentText={cartI18n.autoClose.contentText}
          modalButton={{buttons: modalAutoCloseButton, default: true}}
          delay={inActiveTime}
          isPlaying={state.value === AppFlowStates.BasketFormation}
          closingTimer={closingTime}
          onComplete={() => autoCloseAsync()}
        />}
        { !isHealthDegraded && isCancelPurchase && <AutoCloseTimer
          timerKey={timer}
          timerSize={100}
          headerIcon={<QuestionIcon/>}
          headerText={cartI18n.cancelPurchase.headerText}
          contentHeaderText={state.context.PurchaseContext.items.length > 0 ? cartI18n.cancelPurchase.contentHeaderText : ''}
          contentText={state.context.PurchaseContext.items.length > 0 ? cartI18n.cancelPurchase.contentText : ''}
          modalButton={{buttons: modalCancelPurchaseButtons, default: false}}
          delay={0}
          isPlaying={isCancelPurchase}
          isCancelPurchaseLoading={isCancelPurchaseLoading}
          closingTimer={cancelPurchaseClosingTime}
          onComplete={() => autoCloseAsync()}
        />}
      </SafeAreaView>
    </>

  );
}
