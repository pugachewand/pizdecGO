/* eslint-disable @typescript-eslint/no-magic-numbers */

import { StyleSheet } from 'react-native'
import { globalContext } from '../../../DependencyInjection/AppContext'

const theme = globalContext.theme.value

export const modalStyles = StyleSheet.create({

	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontFamily: 'Montserrat-Regular',
	},
	header: {
		width: '100%',
		minHeight: 90,
		backgroundColor: theme.colors.default,
		flexDirection: 'row',
		alignItems: 'center',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
	},
	iconWrapper: {
		// position: 'absolute',
		maxWidth: 100,
		padding: 20,
	},
	headerText: {
		fontSize: 26,
		fontWeight: '400',
		textAlign: 'center',
		marginLeft: -100,
		flexGrow: 3,
	},

	main: {
		flexDirection: 'column',
		position: 'relative',
		alignItems: 'center',
		paddingHorizontal: 50,
		marginTop: 25,
	},
	mainConnectionError: {
		alignItems: 'flex-start'
	},
	contentHeaderText: {
		width: '80%',
	},
	contentText: {
		fontSize: 22,
		fontWeight: '400',
		color: theme.colors.default,
		marginHorizontal: 20,
		textAlign: 'center',
	},
	contentTextConnection: {
		marginBottom: 0,
		textAlign: 'left',
	},
	contentSubTextConnection: {
		textAlign: 'left',
		marginTop: -25,
		marginBottom: 25,
		color: theme.colors.main,
	},
	contentTextSupport: {
		marginBottom: 15,
		fontFamily: 'Montserrat-Medium',
		textAlign: 'left',
	},
	timer: {
		paddingVertical: 50,
	},
	messengersContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: 200,
		marginLeft: 20,
		marginBottom: 30,
	},
	messenger: {
		alignItems: 'flex-start',
	},
	messengerQrCodeBlock: {
		borderWidth: 5,
		borderColor: theme.colors.default
	},
	messengerQrCode: {
		width: 160,
		height: 160,
		backgroundColor: '#F6F6F6',
	},
	messengerTitle: {
		color: '#fff',
		fontSize: 20,
		marginLeft: 10,
	},
	messengerDescription: {
		marginBottom: 15,
		alignItems: 'center',
		flexDirection: 'row',
	},
	modalView: {
		width: 760,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.backgroundColor,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#888888',
	},
	modalTextWrap: {
		borderBottomWidth: 1,
		borderBottomColor: theme.separator,
		width: '100%',
		paddingHorizontal: 20,
		paddingTop: 10,
	},

	spaceBetween: {
		justifyContent: 'space-between',
	},

	buttonWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		width: '100%',
	},
	modalButton: {
		height: 70,
		width: 350,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		borderWidth: 3,
		borderColor: theme.colors.accent,
	},

	modalButtonAccent: {
		backgroundColor: theme.colors.accent
	},

	textStyle: {
		// TODO: Использовать обертку Custom text
		fontFamily: 'Montserrat-Regular',
		color: theme.colors.accent,
		fontSize: 24,
		fontWeight: '600',
		textAlign: 'center',
	},
	textStyleAccent: {
		color: theme.colors.darkBackground,
	},
	dotLoaderBlock: {
		width: '5%',
		marginVertical: 100,
		marginLeft: -20,
	},
})
