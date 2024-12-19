import React, { useRef } from "react";
import { Animated, View } from 'react-native'
import { DotLoadersStyles as s } from "./DotLoaders.Styles";
import { useFocusEffect } from '@react-navigation/native';


interface dotProps {
  accentColor?: boolean
  medium?: boolean
  small?: boolean
}

const FadeInView = (props: any) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 0

  useFocusEffect(() => {
    Animated.loop(
        Animated.timing(fadeAnim, {
          toValue: 0,
          delay: props.delay,
          duration: props.duration,
          useNativeDriver: true,
        }),
    ).start()
  });

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}>
      {props.children}
    </Animated.View>
  );
};

export const DotLoaders = (props: dotProps) => {
  return (
    <View style={s.dotContainers}>
      <FadeInView duration={1000} delay={400}><View style={[s.dot, props.accentColor && s.accentDot, props.medium && s.medium, props.small && s.small]}></View></FadeInView>
      <FadeInView duration={1000} delay={600}><View style={[s.dot, props.accentColor && s.accentDot, props.medium && s.medium, props.small && s.small]}></View></FadeInView>
      <FadeInView duration={1000} delay={800}><View style={[s.dot, props.accentColor && s.accentDot, props.medium && s.medium, props.small && s.small]}></View></FadeInView>
    </View>
  )
}
