import { OpenPoSErrorIcon } from '../NotReady/Icons/OpenError.Icon';
import {
  PaymentMethodType,
  PaymentStage,
  PaymentSystem,
} from '../../BackendEntities/Payment/PaymentRepoEntity';
import React, { useContext, useEffect, useState } from 'react';
import { mapPaymentOperationStatusCode, mapPrimiKartuOperationStatusCode } from './PaymentStatusCode';
import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine';
import { AutoCloseTimer } from '../../Components/_Common/Timer/AutoCloseTimer';
import { BottomComponent } from '../../Components/_Common/Bottom/Bottom';
import { BottomStyles } from '../../Components/_Common/Bottom/Bottom.Styles';
import { CheckCard } from './Icons/CheckCard.Icon';
import Config from 'react-native-config';
import { CustomText } from '../../Components/_Common/CustomText/CustomText';
import { DotLoaders } from '../../Components/_Common/Loaders/DotLoaders';
import { MainNavigatorRoutesProps } from '../../EntryPoint/MainNavigator';
import { ModalButtonProps } from '../../Components/_Common/Modal/Modal';
import { PaymentStore } from './Payment.Store';
import { QuestionIcon } from '../Cart/Icons/Question.Icon';
import { StyledButton } from '../../Components/_Common/Button/StyledButton';
import { getTotalSum } from '../Cart/ItemsTable/ItemsTable.Store';
import { SafeAreaView, View } from 'react-native';
import { PaymentStyles as s } from './Payment.Styles'
import { useEmergencyReturn } from '../../Infrastructure/EmergencyReturn';
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { EmergencyReturnTimerEnum } from '../../Infrastructure/EmergencyReturn/EmergencyReturnTypes';
import { useI18n } from '../../EntryPoint/Context/i18nContext';
import { useRoute } from '@react-navigation/native';
import { Support } from '../Support/Support';
import { ReconciliationEmitter } from '../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { AppIoCContainer } from '../../Infrastructure/Objects/AppIoContainer';
import { CheckRepo } from '../../Logic/RestApi/Check/CheckRepo';

export const Payment = ({navigation}: MainNavigatorRoutesProps<'payment'>): JSX.Element => {
  const i18n = useI18n().i18n
  const route = useRoute()
  const commonI18n = i18n.common.value
  const paymentI18n = i18n.payment.value
  const setCurrentFunction = useEmergencyReturn(AppFlowStates.Payment, EmergencyReturnTimerEnum.PAYMENT)
  const payment = new PaymentStore()
  const appHealthProvider = AppIoCContainer.getAppHealthProvider()
  const params:any = route.params;
  const [error, setError] = useState(false)
  const [isSupportCustomView, setSupportCustomView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [terminalConnect, setTerminalConnect] = useState(false)
  const [isHealthDegraded, setHealthDegraded] = useState(false)
  const [errText, setErrText] = useState('')
  const [timer, setTimer] = useState(0)
  const modalAutoCloseButton: ModalButtonProps[] = []
  const [state, send] = useContext(AppFlowMachineContext);
  const { PurchaseContext } = state.context
  const reconciliationEmitter = new ReconciliationEmitter()

  console.log('PurchaseContext---------------------------------------', PurchaseContext)
  console.log('state.context.PurchaseContext.init.posOperationId---------------------------------------', state.context.PurchaseContext.init.posOperationId)
  const getPromoBonusesAsync = async () => {
    const checkRepo = new CheckRepo()
    try {
      await checkRepo.bonusPromotionByPosOperation(PurchaseContext.init.posOperationId)
    }
    catch (e) {
      console.log('error')
    }
  }
  const totalSumForPay = () => {
    getPromoBonusesAsync()
    return JSON.stringify(getTotalSum(state.context.PurchaseContext.items))
  }

  const data = {
    paymentSystem: PaymentSystem.PrimiKartu,
    paymentMethodType: PaymentMethodType.TerminalGo,
    posOperationId: PurchaseContext.init.posOperationId,
    paymentStage: PaymentStage.StageOne,
    amount: totalSumForPay(),
    currency: 'RUB'
  }

  const startPaymentAsync = async () => {
    setCurrentFunction('Payment > startPaymentAsync()')
    setError(false)
    setTerminalConnect(false)
    const terminalConnectTimeout = setTimeout(() => {
      setTerminalConnect(true)
    }, 1500);
    if (getTotalSum(state.context.PurchaseContext.items) >= 0) {
      setLoading(true)
      const response = await payment.payOnPress(data)

      if (response) {
        const {success , paymentError} = response
        if(success) {
          send({type: AppFlowEvents.SUCCESS, posOperationId: state.context.PurchaseContext.init.posOperationId})
          setLoading(false)
        }
        if(paymentError) {
          setError(true)
          setLoading(false)
          if(payment.terminalPaymentCode !== 0) {
            setErrText(mapPrimiKartuOperationStatusCode(payment.terminalPaymentCode) || '')
          }else {
            setErrText(mapPaymentOperationStatusCode(paymentError.status))
          }
        } else {
          setError(true)
          setLoading(false)
          setErrText(mapPaymentOperationStatusCode(2))
        }

      } else {
        setError(true)
        setLoading(false)
      }
  }
    clearTimeout(terminalConnectTimeout)
}
  useEffect(() => {
    reconciliationEmitter.subscribe(false)
    setCurrentFunction('')
    getPromoBonusesAsync().then(result => result)
    startPaymentAsync()
    return () => {
      reconciliationEmitter.unsubscribe()
      setCurrentFunction('')
    };
  }, [])

  useEffect(() => {
    if(params?.isCustomSupportView) {
      setSupportCustomView(true)
    }
  }, [params])

  useEffect(() => {
  }, [error])
  useEffect(() => {
    const handleHealthChange = (newHealthStatus: boolean) => {
      setHealthDegraded(newHealthStatus)
    }

    appHealthProvider.subscribe(handleHealthChange)

    return () => {
      appHealthProvider.unsubscribe(handleHealthChange)
    }
  }, [appHealthProvider])

  //TODO: стандартизировать i18n для кнопок
  return (
      <>
        {isSupportCustomView ? <Support navigation={''} isSupportCustomView={isSupportCustomView} setSupportCustomView={setSupportCustomView}/>
            :
            <SafeAreaView style={s.wrap}>
              <View style={s.container}>
                {loading ?
                    <View style={[s.content, s.loading]}>
                      {terminalConnect ?
                          <View style={s.checkCardContainer}>
                            <View style={s.checkCardTextWrap}>
                              <CustomText style={[s.textStyle, s.paymentTextHeader]}>
                                {paymentI18n.payment.header}
                              </CustomText>
                              <CustomText style={[s.textStyle, s.paymentTextDescription]}>
                                {paymentI18n.payment.description}
                              </CustomText>
                            </View>
                            <View style={s.checkCardIcon}>
                              <CheckCard/>
                              <DotLoaders small={true}/>

                            </View>
                            <CustomText style={[s.textStyle, s.paymentTextDescription]}>
                              {paymentI18n.payment.paymentLoading}
                            </CustomText>
                          </View>
                          :
                          <DotLoaders/>

                      }
                    </View> :
                    <View style={s.errorContainer}>
                      <View style={s.headerTop}>
                        <CustomText style={s.paymentTextHeader}>
                          {paymentI18n.payment.paymentError}
                        </CustomText>
                        <CustomText style={[s.paymentTextDescription]}>
                          {paymentI18n.payment.paymentErrorDescription}
                        </CustomText>
                      </View>
                      {errText ?
                          <CustomText style={s.paymentTextDescription}>
                            "{errText}"
                          </CustomText> :
                          <CustomText style={s.paymentTextDescription}>
                            {paymentI18n.payment.defaultPaymentErrorMessage}
                          </CustomText>
                      }
                      <View style={s.errorIconStyle}>
                        <OpenPoSErrorIcon  width={250} height={250} />
                      </View>
                    </View>

                }
                <BottomComponent>
                  {
                      error &&
                      <StyledButton
                          title={commonI18n.buttons.goBack}
                          buttonStyle={BottomStyles.secondaryButtonForCancelPayment}
                          textStyle={BottomStyles.textStyleSecondary}
                          onPress={() => send(AppFlowEvents.CANCEL)} />
                  }
                  {
                      error &&
                      <StyledButton
                          title={commonI18n.buttons.repeatPay}
                          buttonStyle={BottomStyles.activeButton}
                          textStyle={BottomStyles.textStyle}
                          onPress={() => startPaymentAsync()} />
                  }
                </BottomComponent>


              </View>
              {
                  !isHealthDegraded && error && <AutoCloseTimer
                      timerKey={timer}
                      timerSize={100}
                      headerIcon={<QuestionIcon/>}
                      headerText={paymentI18n.autoClose.headerText}
                      contentHeaderText={paymentI18n.autoClose.contentHeaderText}
                      contentText={paymentI18n.autoClose.contentText}
                      modalButton={{buttons: modalAutoCloseButton, default: true}}
                      delay={Number(Config.INACTIVITY_TIMER)}
                      isPlaying={error}
                      closingTimer={Number(Config.CLOSING_TIMER)}
                      onComplete={() => send(AppFlowEvents.CANCEL)}
                  />
              }
            </SafeAreaView>
        }
      </>
  );
}

