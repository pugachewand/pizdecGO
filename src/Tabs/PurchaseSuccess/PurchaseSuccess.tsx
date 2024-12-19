import { Image, SafeAreaView, View } from 'react-native';
import React, {useContext, useState} from 'react';
import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine';
import { BottomComponent } from '../../Components/_Common/Bottom/Bottom';
import { BottomStyles } from '../../Components/_Common/Bottom/Bottom.Styles';
import { CheckRepo } from '../../Logic/RestApi/Check/CheckRepo';
import { CustomText } from '../../Components/_Common/CustomText/CustomText';
import { GlobalStyles } from '../GlobalStyles';
import { MainNavigatorRoutesProps } from '../../EntryPoint/MainNavigator';
import { ReconciliationEmitter } from '../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { StyledButton } from '../../Components/_Common/Button/StyledButton';
import { SuccessfulPurchaseIcon } from './Icons/SuccessfulPurchase.Icon';
import { Timer } from '../../Components/_Common/Timer/Timer';
import { PurchaseSuccessStyles as s } from './PurchaseSuccess.Styles';
import { useFocusEffect } from '@react-navigation/native';
import { useEmergencyReturn } from '../../Infrastructure/EmergencyReturn';
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { EmergencyReturnTimerEnum } from '../../Infrastructure/EmergencyReturn/EmergencyReturnTypes';
import { useI18n } from '../../EntryPoint/Context/i18nContext';
import { FailureSeverity } from '../../Core/connections/MqttClient/IMqttClient';
import {
    generateFailureInfoParams,
    sendFailureInfoToRabbitMqAsync
} from '../../Core/connections/MqttClient/MqttClientMessageRouting';

export const PurchaseSuccess = ({navigation}: MainNavigatorRoutesProps<'purchaseSuccess'>): JSX.Element => {
  const i18n = useI18n().i18n
  const commonI18n = i18n.common.value
  const purchaseSuccessI18n = i18n.purchase.value.purchaseSuccess
  const setCurrentFunction = useEmergencyReturn(AppFlowStates.PurchaseSuccess, EmergencyReturnTimerEnum.PURCHASE_SUCCESS)
  const [state, send] = useContext(AppFlowMachineContext);
  const [fiscalLink, setFiscalLink] = useState<string>()
  //TODO: фиcкальный чек не отображется
  const reconciliationEmitter = new ReconciliationEmitter()
  const checkRepo = new CheckRepo()

  const getFiscalLinkAsync = async () => {
    setCurrentFunction('PurchaseSuccess > getFiscalLinkAsync')
      let getFiscalLink
    if (state.event.posOperationId !== '') {
        try {
            getFiscalLink = await checkRepo.getCheckByID(state.event.posOperationId)
            console.log('getFiscalLink', getFiscalLink.value.unsafeCoerce().fiscalizationInfo?.qrCodeLink)
            setFiscalLink(getFiscalLink.value.unsafeCoerce().fiscalizationInfo?.qrCodeLink || '')
        }catch (e) {
            console.log(`Error setFiscalLink:: ${getFiscalLink?.value.unsafeCoerce()}`)
            const failureInfoParams = generateFailureInfoParams(`Error setFiscalLink:: ${getFiscalLink?.value.unsafeCoerce()}`, FailureSeverity.Normal)
            sendFailureInfoToRabbitMqAsync(failureInfoParams)
        }

    }
  }
  useFocusEffect(
    React.useCallback(() => {
      reconciliationEmitter.subscribe(false)
      getFiscalLinkAsync()
    }, [navigation, state.value])
  );
  return (
    <SafeAreaView style={s.wrapper}>
      <View style={s.container}>
        <View style={s.descriptionContainer}>
          <CustomText style={GlobalStyles.headerTitle}>{purchaseSuccessI18n.gratitude}</CustomText>
          <SuccessfulPurchaseIcon style={s.icon} width={320} height={320}/>
        </View>
        <View style={s.bottom}>
          <View style={s.qrCodeContainer}>
              {fiscalLink && fiscalLink !== '' &&
                <>
                  <CustomText style={[s.textStyle, s.qrText]}>{purchaseSuccessI18n.scanQr}</CustomText>
                  <Image style={s.fiscalQrCode} source={{uri: fiscalLink}}/>
                </>
              }
          </View>
        </View>
        <View style={s.timer}>
          <Timer
              size={80}
              closingTimer={10}
              isPlaying={true}
              onComplete={
                () => {
                  reconciliationEmitter.unsubscribe()
                  send(AppFlowEvents.RETURN)
                }
          }/>
        </View>
      </View>
      <BottomComponent>
        <StyledButton title={commonI18n.buttons.close} buttonStyle={BottomStyles.secondaryButton} textStyle={BottomStyles.textStyleSecondary} disabled={false}
          onPress={() => {
              reconciliationEmitter.unsubscribe()
              send(AppFlowEvents.RETURN)
            }
          }
        />
      </BottomComponent>
    </SafeAreaView>
  );
}
