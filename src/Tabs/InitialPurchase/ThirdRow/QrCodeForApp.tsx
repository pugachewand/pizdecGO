import { View } from 'react-native';
import { CustomText } from '../../../Components/_Common/CustomText/CustomText';
import QRCode from 'react-native-qrcode-svg';
import React from "react";
import { globalContext } from '../../../DependencyInjection/AppContext';
import { InitialPurchaseStyles as s } from "../InitialPurcahses.Styles";
import { useI18n } from '../../../EntryPoint/Context/i18nContext';
import { AppIoCContainer } from '../../../Infrastructure/Objects/AppIoContainer';

export const QrCodeForApp = () => {
    const isProd = globalContext.preferences.value.environmentVariables.environment === 'prod'
    const purchaseI18n = useI18n().i18n.purchase.value
    const appSettings = AppIoCContainer.getAppSettings()
    return (
        <View style={s.QrCodeForAppContainer}>
            <QRCode
            value={isProd ? `https://webpos.izipoint.io/ss/${appSettings.qrCode}` : `https://betawebpos.izipoint.io/ss/${appSettings.qrCode}`}
            />
            <CustomText style={s.QrCodeDescription}>{purchaseI18n.initialPurchase.qrCodeDescription}</CustomText>
        </View>
    )
}
