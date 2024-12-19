import { View } from "react-native";

import { CustomText } from '../../../Components/_Common/CustomText/CustomText';
import { GlobalStyles } from "../../GlobalStyles";
import { HeaderMode } from '../../../Components/_Common/Header/HeaderMode/HeaderMode';
import React from "react";
import { InitialPurchaseStyles as s } from "../InitialPurcahses.Styles";
import { useI18n } from "../../../EntryPoint/Context/i18nContext";

export const Greetings = (props: any) => {
    const purchaseI18n = useI18n().i18n.purchase.value
        return (
            <View style={s.greetingsContainer}>
                <HeaderMode {...props}>
                    <CustomText style={GlobalStyles.headerTitle}>{purchaseI18n.initialPurchase.greetings.title}</CustomText>
                </HeaderMode>
            <CustomText style={GlobalStyles.headerDescription}>{purchaseI18n.initialPurchase.greetings.description}</CustomText>
            </View>
        )
    }
