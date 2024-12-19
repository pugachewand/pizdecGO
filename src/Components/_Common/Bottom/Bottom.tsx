import React from 'react';
import {View} from 'react-native';
import { BottomStyles as s } from './Bottom.Styles';

// TODO: Найти правильный тип пропса

export const BottomComponent = (props: any) => {
    return (
	<View style={[s.container, Object.keys(props.children).length === 2 ? s.containerSpaceBetween : s.containerCenter ]}>
        {props.children}
    </View>
    )
}
