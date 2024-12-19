import {
	ActivityIndicator,
	StyleProp,
	Text,
	TextStyle,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
	ViewStyle,
} from 'react-native'

import { CustomText } from '../CustomText/CustomText'
import React from 'react'
import { globalContext } from '../../../DependencyInjection/AppContext'
import { observer } from 'mobx-react'
import { stylesheet as s } from './StyledButton.Style'

const theme = globalContext.theme.value

export type ButtonProps = {
	title: string
	secondTitle?: string
	thirdTitle?: string
	buttonStyle?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
	loading?: boolean
	loadingText?: string
	wrapStyle?: StyleProp<ViewStyle>
} & TouchableOpacityProps

export const StyledButton = observer((props: ButtonProps) =>
	<TouchableOpacity
		style={[props.buttonStyle]}
		onPress={props.onPress}
		{...props}
	>
		{
			props.loading ?
				<View style={s.wrap}>
					<CustomText style={props.textStyle}>{props.loadingText}</CustomText>
					<ActivityIndicator size='small' color={theme.colors.backgroundColor} />
				</View>
				: props.secondTitle
					? props.thirdTitle
						? <CustomText style={[props.textStyle]}>{props.title} <CustomText style={[props.textStyle, s.line]}>{props.secondTitle}</CustomText> {props.thirdTitle}</CustomText>
						: <CustomText style={props.textStyle}>{props.title} {props.secondTitle}</CustomText>
					: <CustomText style={props.textStyle}>{props.title}</CustomText>
		}
	</TouchableOpacity>
)
