import { View } from "react-native";

import { ArrowToRight } from "../Icons/ArrowToRight.Icon";
import { CustomText } from '../../../Components/_Common/CustomText/CustomText';
import { PaymentGuide } from "../Icons/PaymentGuide.Icon";
import React from "react";
import { ScanGuide } from "../Icons/ScanGuide.Icon";
import { StartButton } from "../Icons/StartButton.Icon";
import { globalContext } from "../../../DependencyInjection/AppContext";
import { observer } from "mobx-react";
import { InitialPurchaseStyles as s } from "../InitialPurcahses.Styles";

@observer
export class UsageGuide extends React.Component {
    private purchaseI18n = globalContext.preferences.value.i18n.purchase.value
    render() {
        return (
            <View style={s.usageGuide}>
              <View style={s.usageGuideInner}>
                <StartButton width={170} height={170}/>
                <CustomText style={s.usageGuideInnerText}>{this.purchaseI18n.initialPurchase.usageGuide.point_1}</CustomText>
              </View>
              <ArrowToRight style={s.ArrowIcon}/>
              <View style={[s.usageGuideInner, s.usageGuideInnerTop]}>
                <ScanGuide width={170} height={170}/>
                <CustomText style={s.usageGuideInnerText}>{this.purchaseI18n.initialPurchase.usageGuide.point_2}</CustomText>
              </View>
              <ArrowToRight style={s.ArrowIcon}/>
              <View style={s.usageGuideInner}>
                <PaymentGuide width={170} height={170}/>
                <CustomText style={s.usageGuideInnerText}>{this.purchaseI18n.initialPurchase.usageGuide.point_3}</CustomText>
              </View>
            </View>
        )
    }
}
