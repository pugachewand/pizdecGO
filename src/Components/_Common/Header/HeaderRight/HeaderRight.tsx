import { TouchableOpacity } from 'react-native'

import { CustomText } from '../../CustomText/CustomText';
import { MainNavigatorRoutes } from '../../../../EntryPoint/MainNavigator'
import { QuestionMark } from './Icons/QuestionMark.Icon';
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { observer } from 'mobx-react'
import { headerRightStyles as s } from './HeaderRight.Styles'
import { useI18n } from '../../../../EntryPoint/Context/i18nContext'
import { globalContext } from '../../../../DependencyInjection/AppContext';

type HeaderRightNavigationProp = StackNavigationProp<MainNavigatorRoutes, 'support'>

type Props = {
	navigation: HeaderRightNavigationProp
}

export const HeaderRight = observer((props: Props) => {
	const currentRoute = globalContext.navigatorRef.value.current?.getCurrentRoute()
	const i18n = useI18n().i18n.header.value
	const navigateToSupport = () => {
		if(currentRoute?.name === 'payment') {
			// @ts-ignore
			props.navigation.navigate('payment', { isCustomSupportView: true });
		}else {
			props.navigation.replace('support')
		}
	}
	return (
		<TouchableOpacity style={s.supportContainer} onPress={() => navigateToSupport()}>
            <QuestionMark />
			<CustomText style={s.captionUnderIcon}>{i18n.title}</CustomText>
		</TouchableOpacity>
	)
}

)
