/* eslint-disable @typescript-eslint/no-magic-numbers */

import { StyleSheet } from 'react-native'
import { globalContext } from '../../../../DependencyInjection/AppContext'

const theme = globalContext.theme.value

export const defaultHeaderModeStyles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
		// borderWidth: 5
	},
	input: {
		backgroundColor: theme.colors.darkBackground,
		color: theme.colors.default,
		borderRadius: 10,
		padding: 10,
		elevation: 2,
		marginBottom: 10,
	},
	title: {
		fontSize: 20,
		color: theme.colors.default,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: theme.colors.backgroundColor,
		borderRadius: 20,
		padding: 35,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 10,
		width: 800,
		alignItems: 'center',
	},
	buttonsInputsContainer: {
		flexDirection: 'row',
		justifyContent:'space-between',
		position:'relative',
		gap: 20,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	modalButton: {
		backgroundColor: theme.buttons.background('valid'),
		borderRadius: 10,
		padding: 10,
		elevation: 2,
		minWidth: 300,
		width: '100%',
		marginBottom: 15,
	},
	textStyle: {
		fontFamily: 'Montserrat-Bold',
		color: theme.buttons.foreground('valid'),
		fontWeight: '600',
		textAlign: 'center',
	},
	commonTextStyle: {
		fontFamily: 'Montserrat-Bold',

		color: theme.colors.default,
		fontWeight: '600',
		textAlign: 'center',
	},
	headerTitle: {
		fontSize: 32
	},
})
