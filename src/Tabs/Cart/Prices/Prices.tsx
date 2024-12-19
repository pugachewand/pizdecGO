import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { getTotalDiscount, getTotalSum } from '../ItemsTable/ItemsTable.Store';

import { AppFlowMachineContext } from '../../../Machines/AppFlow/AppFlowMachine';
import { CustomText } from '../../../Components/_Common/CustomText/CustomText';
import { PricesStyles as s } from './Prices.Styles';
import { useI18n } from '../../../EntryPoint/Context/i18nContext';

export const Prices = () => {
  const [state, send, service] = useContext(AppFlowMachineContext);
  const [totalCost, setTotalCost] = useState(getTotalSum(state.context.PurchaseContext.items) || 0)
  const [totalDiscount, setTotalDiscount] = useState(getTotalDiscount(state.context.PurchaseContext.items) || 0)
  const i18n = useI18n().i18n.cart.value

  useEffect(() => {
      setTotalCost(getTotalSum(state.context.PurchaseContext.items))
      setTotalDiscount(getTotalDiscount(state.context.PurchaseContext.items))
  }, [state.context.PurchaseContext.items])
  return (
    <View style={s.container}>
      {/* //TODO: сделать перевод валюты */}
      <View style={s.textWrap}>
        <CustomText style={s.discountText}>{i18n.itemsTable.discount}</CustomText>
        <CustomText style={s.text}>{totalDiscount} руб.</CustomText>
      </View>
      <View style={s.textWrap}>
        <CustomText style={s.totalText}>{i18n.itemsTable.totalCost}</CustomText>
        <CustomText style={s.text}>{totalCost} руб.</CustomText>
      </View>
    </View>
  )
}
