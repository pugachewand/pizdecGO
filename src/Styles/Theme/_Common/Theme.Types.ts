export type ButtonState = 'valid' | 'invalid' | 'disabled'
export type ButtonStyle = {
	background: (state: ButtonState) => string
	foreground: (state: ButtonState) => string
}

//TODO: выпилить не нужные стили
export type Theme = {
	buttons: ButtonStyle
	grayButton: ButtonStyle
	separator: string
	inputs: {
		underlineColorAndroid: string
		validationErrors: {
			default: string
			selected: string
		}
	}
	unpaidCheck: string
	cancel: string
	removeItem: {
		background: string
		line: string
	}
	alertDropDawnColor:  string
	placeHolderColor: string
	colors: {
		default: string
		main: string
		secondary: string
		backgroundColor: string
		darkBackground: string
		buttonTextColor: string
		accent: string
	}
	countryPicker: {
		primaryColor: string
		primaryColorVariant: string
		backgroundColor: string
		onBackgroundTextColor: string
		fontSize: number
		fontFamily: string
		filterPlaceholderTextColor: string
		activeOpacity: number
		itemHeight: number
		flagSize: number
		flagSizeButton: number
	}
	navigation: {
		activeTintColor: string
		inactiveTintColor: string
		navigationColor: string
		statusBarType: 'default' | 'light-content' | 'dark-content'
		statusBarColor: string
	}
	headerStyle: {
		backgroundColor: string
		height: number
	}
	bottomArea: {
		height: number
	}
}
