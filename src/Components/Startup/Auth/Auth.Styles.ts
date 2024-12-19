/* eslint-disable @typescript-eslint/no-magic-numbers */

import { StyleSheet } from 'react-native'
import { globalContext } from '../../../DependencyInjection/AppContext'

const theme = globalContext.theme.value

export const AuthStyles = StyleSheet.create({
	buttonForeground: {
		fontSize: 16,
		color: theme.buttons.foreground('valid'),
	},
	wrap: {
		flex: 1,
	},
	innerContainer: {
		margin: 7,
		marginTop: 20,
		marginHorizontal: 10,
	},
	title: {
		textAlign: 'center',
		color: theme.colors.default,
		marginBottom: 5,
	},
	bold: {
		fontFamily: 'Montserrat-Bold',
		fontWeight: '600',
	},
	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
		marginBottom: 30,
		marginHorizontal: 20,
	},
	arrowDown: {
		top: 2,
		fontSize: 22,
		color: theme.colors.default,
		transform: [{ rotate: '90deg' }],
	},
	textInput: {
		marginLeft: 15,
		borderBottomColor: theme.colors.main,
		borderBottomWidth: 1,
		padding: 0,
		paddingTop: 0,
		margin: 0,
		flex: 1,
		fontSize: 22,
		color: theme.colors.default,
	},
	bottomTextWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomText: {
		fontSize: 12,
		lineHeight: 16,
		color: theme.colors.default,
		textAlign: 'center',
	},
	link: {
		fontSize: 12,
		lineHeight: 16,
		color: theme.colors.main,
		textDecorationLine: 'underline',
	},
	resendWrap: {
		alignItems: 'center',
		marginBottom: 20,
		marginTop: 20,
	},
	textCenter: {
		textAlign: 'center',
		padding: 1,
		color: theme.colors.default,
	},
	resendCodeButtonText: {
		fontFamily: 'Montserrat-Bold',
		fontSize: 16,
		fontWeight: '600',
		color: theme.colors.default,
	},
	countryPickerContainerButton: {
		marginRight: 10,
	},
	countryPickerTheme: {
		fontSize: 22,
	},
	phonePlaceholder: {
		fontSize: 16,
	},
})
