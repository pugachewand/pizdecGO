import LottieView from "lottie-react-native";
import React from "react"
import { EmptyCartStyles as s } from './EmptyCartList.Styles'

export default function CartEmptyListIcon() {
  return (
    <LottieView style={s.lottieStyles} source={require('./lottie/scanner-animation.json')} autoPlay loop />
  );
}
