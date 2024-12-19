import { Text, View } from 'react-native'

import { CustomText } from '../../CustomText/CustomText';
import { HeaderTitleProps } from '@react-navigation/elements'
import React from 'react'
import { observer } from 'mobx-react'
import { defaultHeaderTitleStyles as s } from './HeaderTitle.Styles'

export const HeaderTitle = observer((props: HeaderTitleProps) =>
	<View style={s.container}>
		<CustomText ellipsizeMode='tail' numberOfLines={1} style={s.title}>{props.children}</CustomText>
	</View>
)
