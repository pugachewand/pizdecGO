import { Image, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine';
import { BottomComponent } from '../../Components/_Common/Bottom/Bottom';
import { BottomStyles } from '../../Components/_Common/Bottom/Bottom.Styles';
import { CustomText } from '../../Components/_Common/CustomText/CustomText';
import { GlobalStyles } from '../GlobalStyles';
import {MainNavigatorRoutes} from 'EntryPoint/MainNavigator';
import { ReconciliationEmitter } from '../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { StyledButton } from '../../Components/_Common/Button/StyledButton';
import { Telegram } from './Icons/Telegram.Icon';
import { Timer } from '../../Components/_Common/Timer/Timer';
import { WhatsApp } from './Icons/WhatsApp.Icon';
import { observer } from 'mobx-react';
import { SupportStyles as s } from './Supports.Styles';
import { useI18n } from '../../EntryPoint/Context/i18nContext';

export type supportProps = StackScreenProps<
    MainNavigatorRoutes,
    'support'
>& {
    isSupportCustomView?: boolean
    setSupportCustomView?: (isShow:boolean) => void
};


export const Support = observer((props: supportProps | null): JSX.Element => {
    const i18n = useI18n().i18n
    const commonI18n = i18n.common.value
    const supportI18n = i18n.support.value
    const [timer, setTimer] = useState(0)
    const [closingTimer, setClosingTimer] = useState(10)
    const [state, send] = useContext(AppFlowMachineContext)
    const reconciliationEmitter = new ReconciliationEmitter()

    const goBackHandler = () => {
      setClosingTimer(0)
      reconciliationEmitter.unsubscribe()
        if(props?.isSupportCustomView) {
            props?.setSupportCustomView && props?.setSupportCustomView(false)
            return
        }
        if(props?.navigation) {
            props.navigation.navigate(state.toStrings()[0], {
                isPayment: true,
            })
        }
    }

    useFocusEffect(
      React.useCallback(() => {
        console.log('subs', 'support')
        reconciliationEmitter.subscribe(false)
      }, [])
    );

    return (
      <View style={s.container}>
        <View style={s.supportIntroContainer}>
            <CustomText style={GlobalStyles.headerTitle}>Помощь</CustomText>
            <CustomText style={s.headerDescription}>{supportI18n.scanQrForConnect}</CustomText>
        </View>
        <View style={s.messengersContainer}>
            <View style={s.messenger}>
                    <Image style={s.messengerQrCode} source={require('./Icons/QrWhatsApp.png')}/>
                <View style={s.messengerDescription}>
                    <WhatsApp />
                    <CustomText style={s.messengerTitle}>WhatsApp</CustomText>
                </View>
            </View>
            <View style={s.messenger}>
                    <Image style={s.messengerQrCode} source={require('./Icons/QrTelegram.png')}/>
                <View style={s.messengerDescription}>
                    <Telegram />
                    <CustomText style={s.messengerTitle}>Telegram</CustomText>
                </View>
            </View>
        </View>
        <View style={s.timer}>
            <Timer timerKey= {timer} size={80} closingTimer={closingTimer} isPlaying={true} onComplete={() => goBackHandler()}/>
        </View>
        <BottomComponent>
          <StyledButton title={commonI18n.buttons.goBack} buttonStyle={BottomStyles.secondaryButton} textStyle={BottomStyles.textStyleSecondary} disabled={false}
              onPress={() => goBackHandler()}
              />
        </BottomComponent>
      </View>
    );
})
