import { StyleSheet } from 'react-native'
import { globalContext } from '../../../DependencyInjection/AppContext'

export const stylesheet = StyleSheet.create({
	wrap: {
		flexDirection: 'row',
	},
	line: {
		 textDecorationLine: 'line-through',
	},
	disabled: {
		backgroundColor: globalContext.theme.value.colors.secondary,
	},
})
