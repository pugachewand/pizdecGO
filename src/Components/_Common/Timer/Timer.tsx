import React, { useEffect, useState } from "react";
import { Text, View } from "react-native"

import Config from "react-native-config";
import {CountdownCircleTimer} from "react-native-countdown-circle-timer"
import { CustomText } from '../CustomText/CustomText';
import { TimerStyles as s } from "./Timer.Styles";

export interface timerProps {
    timerKey?: number
    onComplete: () => void;
    closingTimer?: number
    isPlaying: boolean
    inActiveTimer?: boolean
    size?: number
}
export const Timer = (props:timerProps) => {
  const closingTimer = props.closingTimer ?? Number(Config.CLOSING_TIMER)

  return (
    <View>
          <CountdownCircleTimer
            key={props.timerKey}
            isPlaying={props.isPlaying}
            duration={closingTimer}
            colors= {props.inActiveTimer ? "#ffffff" : "#4a4a4a"}
            trailColor="#00000000"
            size={props.size}
            strokeWidth={3}
            onComplete={() => {
              props.onComplete()
            }}
          >
            {({ remainingTime }) => <CustomText style={props.inActiveTimer ? s.inActiveTimerTextStyle : s.timerTextStyle}>{remainingTime !== 0 && remainingTime}</CustomText>}
          </CountdownCircleTimer>
    </View>
  )
}
