/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Platform, StyleSheet } from 'react-native'

import { hasDisplayCutout } from 'rn-iphone-helper'

const android = 12
const iphone = 24
const iphoneX = 48
const iphoneDistance: number = hasDisplayCutout() ? iphoneX : iphone

export const ModeBadgeStyles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		top: Platform.OS === 'ios' ? iphoneDistance : android,
		left: 44,
		pointerEvents: 'none',
	},
	buttonBackground: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: 'red',
	},
	buttonText: {
		fontFamily: 'Montserrat-Bold',
		fontWeight: '600',
		fontSize: 16,
		color: 'white',
	},
})
