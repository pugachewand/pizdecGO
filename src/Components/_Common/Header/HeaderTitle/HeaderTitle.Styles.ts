/* eslint-disable @typescript-eslint/no-magic-numbers */

import { StyleSheet } from 'react-native'
import { globalContext } from '../../../../DependencyInjection/AppContext'

const theme = globalContext.theme.value

export const defaultHeaderTitleStyles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
		marginLeft: 40,
		marginRight: 40,
	},

	title: {
		fontSize: 20,
		color: theme.colors.default,
	},

	supportContainer: {
		zIndex: 1,
		position: 'absolute',
		display: 'flex',
		alignItems: 'center',
		alignSelf: 'flex-end',
	},

	captionUnderIcon: {
		color: theme.colors.default,
		fontSize: 9,
	},

	text: {
		color: theme.colors.default,
	},
})
