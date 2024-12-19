/* eslint-disable @typescript-eslint/no-magic-numbers */

import { StyleSheet } from 'react-native'
import { globalContext } from '../../../../DependencyInjection/AppContext'

const theme = globalContext.theme.value

export const headerRightStyles = StyleSheet.create({
	supportContainer: {
		zIndex: 1,
		position: 'absolute',
		display: 'flex',
		alignItems: 'center',
		alignSelf: 'flex-end',
		paddingRight: 10,
		minWidth: 60,
	},

	captionUnderIcon: {
		color: theme.colors.default,
		fontSize: 14,
	},

	text: {
		color: theme.colors.default,
	},
})
