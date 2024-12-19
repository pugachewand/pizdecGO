import React, { useContext } from 'react'
import { SafeAreaView, View } from 'react-native'
import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents'
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine'
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { BottomComponent } from '../../Components/_Common/Bottom/Bottom';
import { BottomStyles } from '../../Components/_Common/Bottom/Bottom.Styles';
import { CustomText } from '../../Components/_Common/CustomText/CustomText';
import { GlobalStyles } from '../GlobalStyles'
import { MainNavigatorRoutesProps } from '../../EntryPoint/MainNavigator'
import { OpenPoSErrorIcon } from './Icons/OpenError.Icon'
import { ReconciliationEmitter } from '../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { StyledButton } from '../../Components/_Common/Button/StyledButton';
import { Timer } from '../../Components/_Common/Timer/Timer'
import { useI18n } from '../../EntryPoint/Context/i18nContext'
import { NotReadyStyles as s } from './NotReady.Styles'
import { useFocusEffect } from '@react-navigation/native'


export const NotReady = ({
  navigation,
}: MainNavigatorRoutesProps<'notReady'>): JSX.Element => {
  const [state, send] = useContext(AppFlowMachineContext)
  const i18n = useI18n().i18n
  const errorViewText = i18n.errorView.value.notReady
  const commonText = i18n.common.value
  const errorTitle = state.event.errorTitle
  const errorMessage = state.event.errorMessage
  const isPosTokenNotValid = state.event.isPosTokenNotValid
  const reconciliationEmitter = new ReconciliationEmitter()
  useFocusEffect(
    React.useCallback(() => {
      console.log('subsNotReady', state.value)
      reconciliationEmitter.subscribe(false)
      return () => {
        console.log('unsubsNotReady', state.value)
        reconciliationEmitter.unsubscribe()
      }
    }, [navigation, state.value])
  );
  const onClickHandle = async () => {
      if(isPosTokenNotValid) {
          send({type: AppFlowEvents.PURCHASE_INVITATION, isPosTokenNotValid: true})
      }
      console.log('history::: ',  state.history?.value)
      if (state.history?.value && state.history.value === AppFlowStates.EngineeringMenu) {
        send(AppFlowEvents.RETURN_TO_ENGINEERING_MENU)
      }
      else if (state.history?.value && state.history.value === AppFlowStates.UsbDevicesCheck) {
        send(AppFlowEvents.RETURN)
      }
      else {
        send(AppFlowEvents.REPEAT)
      }
  }
  return (
    <>
    <SafeAreaView style={s.wrapper}>
        <View style={s.container}>
          <View style={s.descriptionContainer}>
            <CustomText style={GlobalStyles.headerTitle}>
              {errorTitle || errorViewText.errorTitle}
            </CustomText>
            <CustomText style={[GlobalStyles.headerDescription, { textAlign: "center"}]}>
              {errorMessage || errorViewText.additionalDescription}
            </CustomText>
            <OpenPoSErrorIcon style={s.errorIcon} width={250} height={250} />
          </View>
          <View style={s.timer}>
            <Timer size={80} closingTimer={10} isPlaying={true} onComplete={() => onClickHandle()}/>
          </View>
        </View>
        <BottomComponent>
        <StyledButton title={commonText.buttons.repeat} buttonStyle={BottomStyles.secondaryButton} textStyle={BottomStyles.textStyleSecondary} disabled={false}
            onPress={() => onClickHandle()}
            />
        </BottomComponent>
      </SafeAreaView>
    </>

  )
}
