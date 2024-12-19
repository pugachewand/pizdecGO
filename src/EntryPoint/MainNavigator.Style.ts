/* eslint-disable @typescript-eslint/no-magic-numbers */

import { StyleSheet } from 'react-native'

export const Style = StyleSheet.create({
	badgeStyle: {
		maxWidth: 12,
		maxHeight: 12,
		lineHeight: 9,
		alignSelf: undefined,
		backgroundColor: 'red',
		color: 'red',

	},
	flex: {
		flex: 1,
	},
	usbDevicesStatusContainer: {
		position: 'absolute',
        right: 130,
        top: 35,
        zIndex: 10,
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
	},
	terminalImage: {
		width: 28,
		height: 28,
	}
})
