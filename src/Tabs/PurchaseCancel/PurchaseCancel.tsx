import { SafeAreaView, View } from 'react-native'
import React, { useContext, useState } from 'react'
import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents'
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine'
import { BottomComponent } from '../../Components/_Common/Bottom/Bottom';
import { BottomStyles } from '../../Components/_Common/Bottom/Bottom.Styles';
import { CustomText } from '../../Components/_Common/CustomText/CustomText';
import { DotLoaders } from '../../Components/_Common/Loaders/DotLoaders'
import { MainNavigatorRoutesProps } from '../../EntryPoint/MainNavigator'
import { ReconciliationEmitter } from '../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { StyledButton } from '../../Components/_Common/Button/StyledButton';
import { cancelPurchaseAsync } from './PurchaseCancel.Store'
import { PurchaseCancelStyles as s } from './PurchaseCancel.Styles'
import { useFocusEffect } from '@react-navigation/native'
import { useEmergencyReturn } from '../../Infrastructure/EmergencyReturn';
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { useI18n } from '../../EntryPoint/Context/i18nContext'

function PurchaseCancel({}: MainNavigatorRoutesProps<'purchaseCancel'>): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [state, send] = useContext(AppFlowMachineContext)
  const setCurrentFunction = useEmergencyReturn(AppFlowStates.PurchaseCancel)
  const cancelPurchaseI18n = useI18n().i18n.purchase.value.cancelPurchase
  const cancelPurchaseHandleAsync = async () => {
    setCurrentFunction('PurchaseCancel > cancelPurchaseHandleAsync()')
    setLoading(true)
    let result = false
    try {
      result = await cancelPurchaseAsync(
          state.context.PurchaseContext.init.posOperationId,
      )
    } catch (e) {
      console.log(`Error cancel purchase with posID ${state.context.PurchaseContext.init.posOperationId} :: `, e)
    }

    if (result) {
      send(AppFlowEvents.SUCCESS)
    }
    setLoading(false)
  }
  const reconciliationEmitter = new ReconciliationEmitter()
  useFocusEffect(
    React.useCallback(() => {
      console.log('subs', state.value)
      reconciliationEmitter.subscribe(false)

      return () => {
        console.log('unsubs', state.value)
        reconciliationEmitter.unsubscribe()
      }

    }, [])
  );
  return (
    <SafeAreaView style={s.wrapper}>
      {
        loading ?
        <DotLoaders accentColor={true}/>
          :
        <>
          <View style={s.container}>
            <CustomText style={s.textStyle}>{cancelPurchaseI18n.question}</CustomText>
          </View>
          <BottomComponent>
            <StyledButton
              title={cancelPurchaseI18n.continuePurchase}
              buttonStyle={BottomStyles.activeButton}
              textStyle={BottomStyles.textStyle}
              onPress={() => send(AppFlowEvents.RETURN)}
            />
            <StyledButton
              title={cancelPurchaseI18n.cancelPurchase}
              buttonStyle={BottomStyles.secondaryButton}
              textStyle={BottomStyles.textStyleSecondary}
              onPress={() => setTimeout(cancelPurchaseHandleAsync, 1000)}
            />
          </BottomComponent>
        </>
      }

    </SafeAreaView>
  )
}

export default PurchaseCancel
