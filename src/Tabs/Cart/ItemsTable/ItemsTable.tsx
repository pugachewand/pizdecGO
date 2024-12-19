import {
    AddCheckItemStatusEntity,
    DeleteCheckItemStatusEntity,
    IAddOrDeleteCheckItemResponseEntity,
    ICheckItemRequisitesEntity
} from '../../../BackendEntities/Cart/ProductEntity';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import {
    addCheckItemEitherAsync,
    arraysHaveSameObjects,
    deleteCheckItemEitherAsync,
    mapAddCheckResponseToMessage
} from './ItemsTable.Store';

import AppFlowEvents from '../../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../../Machines/AppFlow/AppFlowMachine';
import CartEmptyListIcon from '../EmptyCartList/EmptyCartList';
import Config from 'react-native-config';
import { CustomText } from '../../../Components/_Common/CustomText/CustomText';
import { FoodIcon } from '../Icons/Food.Icon';
import { TrashBin } from '../Icons/TrashBin.Icon'
import { UsbConnector } from '../../../Infrastructure/UsbConnector/UsbConnector';
import { ItemsTableStyles as s } from './ItemsTable.Styles'
import { useFocusEffect } from '@react-navigation/native';
import { useI18n } from '../../../EntryPoint/Context/i18nContext';
import {
    generateFailureDebugInfo,
    generateFailureInfoParams,
    sendFailureInfoToRabbitMqAsync
} from '../../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity } from '../../../Core/connections/MqttClient/IMqttClient';
import { DotLoaders } from '../../../Components/_Common/Loaders/DotLoaders';
import { globalContext } from '../../../DependencyInjection/AppContext';
import { getUnpaidPurchaseAsync } from '../../PurchaseInit/PurchaseInit.Store';

const uniqueItems = (items: any[]) => {
  return [ ...new Set(items.map(obj => obj.goodName))].map(goodName => { return items.find(obj => obj.goodName === goodName)})
}
type ItemsTablePropsType = {
    setItemLoading: (isLoading: boolean) => void
    isItemLoading: boolean
}
type needSynchronizeType = {
    isRequired: boolean
    itemsFromServer: ICheckItemRequisitesEntity[]
}
const startCartItemsSynchronize = async (cartItems: ICheckItemRequisitesEntity[], posOperationId: number) => {
    const response = await getUnpaidPurchaseAsync()
    const returnResult = {
        isRequired: false,
        itemsFromServer: []
    }
    if(!response) {
        return returnResult
    }
    const itemsFromServer = response?.items ? (response?.items).flat() : []
    console.log('cartItems', cartItems)
    const isHaveDifferenceItem = arraysHaveSameObjects(cartItems, itemsFromServer)
    console.log('isHaveDifferenceItem', isHaveDifferenceItem)
    const debugInfo = generateFailureDebugInfo(1,
        'Cart is synchronized',
        '', posOperationId)
    const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.BASKET_ITEM_ADD)
    sendFailureInfoToRabbitMqAsync(failureInfoParams)

    return {
        isRequired: isHaveDifferenceItem,
        itemsFromServer
    }
}
export const ItemsTable = ((props: ItemsTablePropsType) => {
  const [state, send] = useContext(AppFlowMachineContext);
  const [isLoading, setLoading] = useState(false)
  const { isItemLoading, setItemLoading } = props
  const { items } = state.context.PurchaseContext
  const usbConnector = new UsbConnector()
  const i18n = useI18n().i18n.cart.value

  const addProductHandleAsync = async (label: string) => {
      if(isItemLoading) {
          return
      }
    usbConnector.unsubscribe()
    try {
      const { posOperationId, posId } = state.context.PurchaseContext.init
      setLoading(true)
      setItemLoading(true)
      const apiCallResponse = await addCheckItemEitherAsync({posId, label, posOperationId}) as IAddOrDeleteCheckItemResponseEntity
      const failureSeverity = apiCallResponse.status === AddCheckItemStatusEntity.Success ? FailureSeverity.Lowest : FailureSeverity.Normal
      const debugInfo = generateFailureDebugInfo(apiCallResponse.status, mapAddCheckResponseToMessage(apiCallResponse.status as AddCheckItemStatusEntity), apiCallResponse?.error, posOperationId)
      const failureInfoParams = generateFailureInfoParams(debugInfo, failureSeverity, FailureDebugCause.BASKET_ITEM_ADD)
      sendFailureInfoToRabbitMqAsync(failureInfoParams)
      if (apiCallResponse.status === AddCheckItemStatusEntity.Success){
          send({type: AppFlowEvents.ADD_PRODUCT, event: apiCallResponse.checkItemRequisites})
      } else {
          const needSynchronize: needSynchronizeType = await startCartItemsSynchronize(state.context.PurchaseContext.items, posOperationId)
          if(needSynchronize.isRequired) {
              send({type: AppFlowEvents.UPDATE_BASKET_PRODUCT_ITEMS, event: needSynchronize.itemsFromServer})
          }
      }
    }catch (e) {
        console.log('Error add basketItem::', e)
        const debugInfo = generateFailureDebugInfo(1, '', 'Error add basketItem::' + e, state.context.PurchaseContext.init.posOperationId)
        const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.BASKET_ITEM_ADD)
        sendFailureInfoToRabbitMqAsync(failureInfoParams)
    }
    finally {
      setLoading(false)
      setItemLoading(false)
      usbConnector.subscribe(addProductHandleAsync)
    }
  }


  const [checkRows, setCheckRows] = useState(uniqueItems(items))

  useEffect(() => {
    setCheckRows(state.context.PurchaseContext.items)
  }, [state.context.PurchaseContext.items])

  // Второй useEffect для того чтобы не плодились подписки на событие
  useFocusEffect(
    React.useCallback(() => {
      console.log('init listener')
      usbConnector.subscribe(addProductHandleAsync)
      return () => {
        console.log('unsub listener')
        usbConnector.unsubscribe()
      };
    }, [])
  )
  return (

    <View style={[s.container, checkRows.length > 0 && s.paddingTop]}>
      {
        Config.DEBUG_MODE == 'true' &&
        <TouchableOpacity onPress={async () => await addProductHandleAsync('23987932752')}>
              <Text style={s.defaultAddProduct}>
                Добавить товар
              </Text>
        </TouchableOpacity>
      }

       {
        checkRows.length > 0 ?
        <View>
          <View style={s.rowHeader}>
              <View style={s.rowItemHeader}>
                <Text style={s.textHeader}>{i18n.itemsTable.name}</Text>
              </View>
              <View style={[s.rowItemHeader]}>
                <Text style={s.textHeader}>{i18n.itemsTable.quantity}</Text>
              </View>
              <View style={[s.rowItemHeader, {marginRight: 50}]}>
                <Text style={s.textHeader}>{i18n.itemsTable.price}</Text>
              </View>
            </View>
          <FlatList
            data={checkRows}
            persistentScrollbar
            renderItem={({ item }) => <RenderItem
                item={item}
                isItemLoading={isItemLoading}
                setItemLoading={setItemLoading}
                />
              }
            keyExtractor={item => item?.labeledGoodId}
          />
            {isLoading && <View style={[s.row, s.loaderAddItem, checkRows.length > 2 && s.loaderAddItems]}>
                <DotLoaders accentColor={false} small={true}/>
          </View>}
        </View> :
        <View style={s.emptyListContainer}>
            {!isLoading && <CartEmptyListIcon/>}
            {isLoading && checkRows.length === 0 && <View>
                <View style={s.dotLoaderBlock}>
                    <DotLoaders accentColor={false} medium={true}/>
                </View>
            </View>}
        </View>
      }
    </View>

  )
})

// TODO:
// При получении незавершенной покупки (после, например, закрытия приложения, рестарте планшета и других внештатных событий) Фронт не может понять по какому принципу удалять и добавлять товары, потому что метка штрих кода не передается с бэка, а сохраняю, в данный момент, я ее при сканировании товара. Соответственно у меня недостаточно данных для фильтрации и взаимодействия с товарами, которые не прошли через сканер. На фронт с бэка нужно передавать BC метку

type RenderItemPropsType = {
    item: ICheckItemRequisitesEntity
    isItemLoading: boolean
    setItemLoading: (isLoading: boolean) => void
}
const RenderItem = (props: RenderItemPropsType) => {
  const [state, send] = useContext(AppFlowMachineContext);
  const [isLoading, setLoading] = useState(false)
  const { item, isItemLoading, setItemLoading } = props
  const { posOperationId, posId } = state.context.PurchaseContext.init
  const { items } = state.context.PurchaseContext
  const i18n = useI18n().i18n.cart.value

  const removeItemHandleAsync = async (label: string) => {
      if(isItemLoading) {
          return
      }
      try {
          setLoading(true)
          setItemLoading(true)
          const apiCall = await deleteCheckItemEitherAsync(label, items, posId, posOperationId) as IAddOrDeleteCheckItemResponseEntity
          const failureSeverity = apiCall.status === DeleteCheckItemStatusEntity.Success ? FailureSeverity.Lowest : FailureSeverity.Normal
          const debugInfo = generateFailureDebugInfo(apiCall.status, mapAddCheckResponseToMessage(apiCall.status as AddCheckItemStatusEntity), apiCall.error, posOperationId)
          const failureInfoParams = generateFailureInfoParams(debugInfo, failureSeverity, FailureDebugCause.BASKET_ITEM_REMOVE)
          sendFailureInfoToRabbitMqAsync(failureInfoParams)

          if(apiCall.status === DeleteCheckItemStatusEntity.Success) {
              send({type: AppFlowEvents.REMOVE_PRODUCT, event: apiCall.checkItemRequisites})
          } else {
              const needSynchronize: needSynchronizeType = await startCartItemsSynchronize(state.context.PurchaseContext.items, posOperationId)
              if(needSynchronize.isRequired) {
                  send({type: AppFlowEvents.UPDATE_BASKET_PRODUCT_ITEMS, event: needSynchronize.itemsFromServer})
              }
          }
      }catch (e) {
          console.log('Error remove basketItem::', e)
          const debugInfo = generateFailureDebugInfo(1, '', 'Error remove basketItem::' + e, posOperationId)
          const failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Normal, FailureDebugCause.BASKET_ITEM_REMOVE)
          sendFailureInfoToRabbitMqAsync(failureInfoParams)
      }finally {
          setLoading(false)
          setItemLoading(false)
      }

  }
  const currency = item.currency === 'RUB' ? 'руб.' : item.currency
  return (
      <View style={s.row}>
          <>
              <View style={s.rowItemIcon}>
                  <View style={s.itemIcon}>
                      {item.goodImagePath !== '' ?
                          <Image
                              style={s.itemIconImage}
                              source={{
                                  uri: item.goodImagePath,
                              }}
                          />
                          :
                          <FoodIcon width={49} height={49}/>
                      }
                  </View>
              </View>
              <View style={s.rowItem}>
                  <CustomText style={s.text}>{item.goodName}</CustomText>
                  <CustomText style={s.text}>{item.goodCalories} {i18n.itemsTable.calories}</CustomText>
              </View>
              <View style={[s.rowItem, s.rowItemCount]}>
                  <CustomText style={[s.text, s.textCount]}>1 шт.</CustomText>
              </View>
              <View style={[s.rowItem, s.rowItemPrice]}>
                  <CustomText style={item.discountAmount > 0 ? s.priceStrikethrough : s.text}>{item.price} {currency}</CustomText>
                  {item.discountAmount > 0 &&
                      <CustomText style={s.text}>{item.price - item.discountAmount} {currency}</CustomText>
                  }
              </View>
              <TouchableOpacity onPress={async () => !isLoading && await removeItemHandleAsync(item.label)}>
                  <View style={s.rowItemDelete}>
                      {isLoading ? <View style={s.loaderDeleteItem}>
                          <ActivityIndicator size="large" color={globalContext.theme.value.colors.accent} />
                      </View>
                          :    <TrashBin />
                      }
                  </View>
              </TouchableOpacity>
          </>
      </View>
  )
}
