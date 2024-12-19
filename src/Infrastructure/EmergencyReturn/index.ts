import { useContext, useEffect, useRef, useState } from 'react'
import { AppFlowMachineContext } from '../../Machines/AppFlow/AppFlowMachine'
import AppFlowEvents from '../../Machines/AppFlow/AppFlowEvents';
import AppFlowStates from '../../Machines/AppFlow/AppFlowStates';
import { cancelPurchaseAsync } from '../../Tabs/PurchaseCancel/PurchaseCancel.Store';
import { failureInfoParams } from '../../Core/connections/MqttClient/MqttClientConnection';
import { FailureSeverity } from '../../Core/connections/MqttClient/IMqttClient';
import { globalContext } from '../../DependencyInjection/AppContext';
import { sendFailureInfoToRabbitMqAsync } from '../../Core/connections/MqttClient/MqttClientMessageRouting';

export type setCurrentFunctionType =  (value: string) => void
/**
 * Хук для установки таймера аварийного возврата.
 * @param navigationState
 * @param {number} timeoutDuration - Время до аварийного возврата в миллисекундах.
 * @returns {setCurrentFunctionType} Функция для установки текущей "застрявшей" функции.
 */
export const useEmergencyReturn = (navigationState= AppFlowStates.PurchaseInvitation, timeoutDuration: number = 600000): setCurrentFunctionType => { // 10 минут по умолчанию
    const [state, send] = useContext(AppFlowMachineContext)
    const [currentFunction, setCurrentFunction] = useState('')
    const currentRoute = globalContext.navigatorRef.value.current?.getCurrentRoute()
    const [repeatNumber, setRepeatNumber] = useState(0)
    const currentFunctionRef = useRef('')

    useEffect(() => {
        currentFunctionRef.current = currentFunction
    }, [currentFunction])


    useEffect(() => {
        // Установка таймера для тайм-аута
        const generateFailureInfoParams = (): failureInfoParams => {
            return {
                state: currentRoute?.name as AppFlowStates,
                currentFunction: currentFunctionRef.current, // Используем текущее значение currentFunction из useRef
                severity: FailureSeverity.Critical,
                postToHotline: true,
            }
        }
        if(currentRoute?.name === navigationState) {
            setRepeatNumber(repeatNumber + 1)
        }
        const timerCallback = async () => {
            console.log('currentFunctionRef.current', currentFunctionRef.current)
            if (currentFunctionRef.current && currentRoute?.name === navigationState) {
                console.log(`Аварийный возврат из-за застревания в функции: ${currentFunctionRef.current}`)
                const failureInfo = generateFailureInfoParams();
                await sendFailureInfoToRabbitMqAsync(failureInfo)
                switch (navigationState) {
                    case AppFlowStates.Init as string: {
                        send(AppFlowEvents.REPEAT)
                        break
                    }
                    case AppFlowStates.UsbDevicesCheck as string: {
                        send(AppFlowEvents.RETURN_TO_ENGINEERING_MENU)
                        break
                    }
                    case AppFlowStates.PurchaseInit as string:
                        if (state.context.PurchaseContext.init.posOperationId) {
                            await cancelPurchaseAsync(state.context.PurchaseContext.init.posOperationId)
                        }
                        send(AppFlowEvents.CANCEL)
                        break
                    case AppFlowStates.BasketFormation as string:
                    case AppFlowStates.Payment as string:
                    {
                        if (state.context.PurchaseContext.init.posOperationId) {
                            await cancelPurchaseAsync(state.context.PurchaseContext.init.posOperationId)
                        }
                        send({type: AppFlowEvents.PURCHASE_INVITATION})
                        break
                    }
                    case AppFlowStates.PurchaseSuccess as string:
                        send({type: AppFlowEvents.RETURN})
                        break
                    case AppFlowStates.PaymentReconciliation as string:
                        send({type: AppFlowEvents.SUCCESS})
                        break
                    default:
                        send({type: AppFlowEvents.PURCHASE_INVITATION})

                }
            }

        };
        let timerId: NodeJS.Timeout;
        const startTimer = () => {
            timerId = setTimeout(timerCallback, timeoutDuration);
        };
        const clearTimer = () => {
            clearTimeout(timerId);
        };

        if (currentRoute?.name === navigationState && currentFunction !== '') {
            startTimer();
        } else {
            clearTimer();
        }

        return clearTimer;

    }, [timeoutDuration, navigationState, currentRoute, currentFunction])

    return setCurrentFunction
};
