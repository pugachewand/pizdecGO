import { DoorPositionEntity, PosOperationStatusEntity } from '../../BackendEntities/Cart/PurchaseRepoEntity';
import React, {useContext, useEffect} from 'react';

import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine';
import { MainNavigatorRoutesProps } from '../../EntryPoint/MainNavigator';
import { PurchaseInitStyles } from './PurchaseInit.Styles';
import { ReconciliationEmitter } from '../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import {View} from 'react-native';
import { mapPurchaseResponseToMessage, startPurchaseAsync } from './PurchaseInit.Store';
import { useFocusEffect } from '@react-navigation/native';
import { DotLoaders } from '../../Components/_Common/Loaders/DotLoaders';
import { useEmergencyReturn } from '../../Infrastructure/EmergencyReturn';
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { EmergencyReturnTimerEnum } from '../../Infrastructure/EmergencyReturn/EmergencyReturnTypes';
import {
  generateFailureDebugInfo,
  generateFailureInfoParams,
  sendFailureInfoToRabbitMqAsync
} from '../../Core/connections/MqttClient/MqttClientMessageRouting';
import { FailureDebugCause, FailureSeverity } from '../../Core/connections/MqttClient/IMqttClient';

function PurchaseInit({navigation}: MainNavigatorRoutesProps<'purchaseInit'>): JSX.Element {
  const [state, send] = useContext(AppFlowMachineContext)
  const setCurrentFunction = useEmergencyReturn(AppFlowStates.PurchaseInit, EmergencyReturnTimerEnum.PURCHASE_INIT)

  useEffect(() => {
    async function startPurchase() {
      setCurrentFunction('PurchaseInit > startPurchase()')

      if (state.event.check) {
        send({ type: AppFlowEvents.SUCCESS, event: state.event.check })
      }
      else {
        const startPurchase = await startPurchaseAsync(DoorPositionEntity.Left)
        console.log('startPurchase:: ', startPurchase)
        let debugInfo = ''
        let failureInfoParams
        if(startPurchase !== false && startPurchase) {
          debugInfo = generateFailureDebugInfo(startPurchase.status || 0, mapPurchaseResponseToMessage(startPurchase.status))
        }

        if (startPurchase !== false && startPurchase && startPurchase.status === PosOperationStatusEntity.Success) {
          failureInfoParams = generateFailureInfoParams(debugInfo,
              FailureSeverity.Lowest,
              FailureDebugCause.INITIATE_PURCHASE
          )
          send({ type: AppFlowEvents.SUCCESS, event: startPurchase })
        }
        else {
          failureInfoParams = generateFailureInfoParams(debugInfo,
              FailureSeverity.Normal,
              FailureDebugCause.INITIATE_PURCHASE
          )
          send({ type: AppFlowEvents.ERROR })
        }
        sendFailureInfoToRabbitMqAsync(failureInfoParams)
      }
    }

    setTimeout(startPurchase, 1000)

  }, [])

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
    <View style={PurchaseInitStyles.container}>
        <DotLoaders accentColor={false}/>
    </View>
  );
}

export default PurchaseInit;
