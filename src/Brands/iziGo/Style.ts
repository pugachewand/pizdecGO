import { DARK_THEME } from 'react-native-country-picker-modal'
import { Dimensions } from 'react-native'
import { Theme } from '../../Styles/Theme/_Common/Theme.Types'

const screenHeight = Dimensions.get('window').height

export const Style: Theme = {
	buttons: {
		background: state => {
			switch (state) {
				case 'valid':
					return '#EEF33E'
				case 'invalid':
					return '#ff7043'
				case 'disabled':
					return '#444'
			}
		},
		foreground: _ => '#595959',
	},
	grayButton: {
		background: state => {
			switch (state) {
				case 'valid':
					return '#888'
				case 'invalid':
					return '#ff7043'
				case 'disabled':
					return '#444'
			}
		},
		foreground: _ => '#fff',
	},
	separator: '#EBEBEB',
	inputs: {
		underlineColorAndroid: '#7ecb20',
		validationErrors: {
			default: '#e57373',
			selected: '#f44336',
		},
	},
	cancel: '#4A4A4A',
	removeItem: {
		background: '#888',
		line: '#fff',
	},
	unpaidCheck: '#ff6666',
	alertDropDawnColor: '#CC3132',
	placeHolderColor: '#949494',
	colors: {
		default: '#fff',
		main: '#EEF33E',
		secondary: '#cccccc',
		backgroundColor: '#595959',
		darkBackground: '#454545',
		buttonTextColor: '#595959',
		accent: '#EEF33E',
	},
	countryPicker: DARK_THEME,
	navigation: {
		activeTintColor: '#EEF33E',
		inactiveTintColor: '#fff',
		navigationColor: '#4A4A4A',
		statusBarColor: '#000',
		statusBarType: 'light-content',
	},
	headerStyle: {
		backgroundColor: '#4A4A4A',
		height: screenHeight < 800 ? 100 : 133
	},
	bottomArea: {
		height: screenHeight < 800 ? 100 : 133
	}
}
