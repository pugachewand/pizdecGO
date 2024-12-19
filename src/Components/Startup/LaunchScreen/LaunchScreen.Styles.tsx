/* eslint-disable @typescript-eslint/no-magic-numbers */

import { StyleSheet } from 'react-native'
import { globalContext } from '../../../DependencyInjection/AppContext'

const commonTheme = globalContext.theme.value

export const LaunchScreenStyles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: commonTheme.colors.backgroundColor,
		justifyContent: 'center',
	},
	izipointIcon: {
		marginLeft: 10,
	},
	container: {
		flexDirection: 'row',
	},
	loaderContainer: {
		flexGrow: 2,
	},
	unstabilityContainer: {
		position: 'absolute',
		zIndex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'flex-end',
		bottom: 0,
	},
	text: {
		fontFamily: 'Montserrat-SemiBold',
		color: 'white',
		fontWeight: "800",
		fontSize: 18,
	},
	textContainer: {
		marginBottom: 50,
	}
})

export const UnstabilityVersionViewStyles = StyleSheet.create({
	unstabilityMask: {
		position: 'absolute',
		zIndex: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#000',
		opacity: 0.5,
	},
	mainContainer: {
		backgroundColor: commonTheme.colors.backgroundColor,
		padding: 16,
		margin: 10,
		borderRadius: 10,
	},
	textContainer: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	stabilityMessage: {
		fontFamily: 'Montserrat-Bold',
		flexGrow: 1,
		color: commonTheme.colors.default,
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'center',
	},
	loadButton: {
		backgroundColor: commonTheme.colors.main,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 16,
		padding: 16,
		borderRadius: 8,
	},
	loadButtonText: {
			fontFamily: 'Montserrat-Bold',
			fontSize: 16,
		fontWeight: '600',
		color: commonTheme.colors.backgroundColor,
	},
})