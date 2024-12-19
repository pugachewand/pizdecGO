import { MainModal, ModalButtonProps } from "../Modal/Modal"
import React, { ReactElement, useEffect, useState } from "react"
import { View } from 'react-native'
import { TimerStyles as s } from "./Timer.Styles"
import { globalContext } from '../../../DependencyInjection/AppContext';
import { AppIoCContainer } from '../../../Infrastructure/Objects/AppIoContainer';

export interface autoCloseProps {
  delay: number
  timerKey: number
  modalButton: {
    buttons: ModalButtonProps[]
    default: boolean
  }
  headerIcon?: ReactElement
  headerText?: string
  contentHeaderText?: string
  contentText?: string
  onComplete: () => void;
  closingTimer: number
  isPlaying: boolean
  isConnectionError?: boolean
  isConnectionTerminalWithBank?: boolean
  timerSize: number
  isCancelPurchaseLoading?: boolean
}
export const AutoCloseTimer = (props: autoCloseProps) => {
  const [timerId, setTimerId] = useState(0);
  const [time, setTime] = useState(false)
  const appHealthProvider = AppIoCContainer.getAppHealthProvider()
  const infoI18n = globalContext.preferences.value.i18n.info.value
  const modalAlertButton = [
    ...props.modalButton.buttons,
  ]
  const modalDefaultAlertButton = [
    ...props.modalButton.buttons,
    {name: 'Продолжить', onPress: () => startTimer(), accent: true},
  ]

  const startTimer = () => {
      setTime(false)

      if (timerId) {
        clearTimeout(timerId);
      }

      const newTimerId = setTimeout(() => {
        if(appHealthProvider.isHealthDegraded && !props.isConnectionError) {
          setTime(false)
        }else {
          setTime(true)
        }
      }, props.delay*1000)
      // TODO: типизировать
      setTimerId(newTimerId)
  }

  useEffect(() => {
    if(props.isPlaying) {
      startTimer();
    }
    return () => {
        clearTimeout(timerId);
        setTime(false)
    }
  }, [props.timerKey, props.isPlaying,appHealthProvider.isHealthDegraded, props.isConnectionError]);

  return (
    <>
      {
        time && props.isPlaying &&
          <View style={s.inActiveTimerContainer}>
            <MainModal
              timerKey={timerId}
              timerSize = {props.timerSize}
              headerIcon={props.headerIcon}
              buttons={props.modalButton.default ? modalDefaultAlertButton : modalAlertButton}
              headerText={props.headerText}
              contentHeaderText={props.contentHeaderText}
              contentText={props.contentText}
              isConnectionError={props.isConnectionError}
              isConnectionTerminalWithBank={props.isConnectionTerminalWithBank}
              hotlineSupportDescription={infoI18n.support.hotlineSupportDescription}
              closingTimer={props.closingTimer}
              isCancelPurchaseLoading={props.isCancelPurchaseLoading}
              isPlaying={time && props.isPlaying}
              onComplete={props.onComplete}
            />
          </View>
      }
    </>
  )
}
