/* eslint-disable @typescript-eslint/no-magic-numbers */

import { globalContext } from '../../../DependencyInjection/AppContext'
import { StyleSheet } from 'react-native'

const commonTheme = globalContext.theme.value

export const DotLoadersStyles = StyleSheet.create({
	dotContainers: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	dot: {
		width: 50,
		height: 50,
		backgroundColor: commonTheme.colors.backgroundColor,
		borderRadius: 100,
		marginHorizontal: 25,
	},
	medium: {
		width: 40,
		height: 40,
	},
	small: {
		width: 20,
		height: 20,
		marginHorizontal: 10,
	},
	accentDot: {
		backgroundColor: commonTheme.colors.accent
	}
})
