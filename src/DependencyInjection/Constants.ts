import { AppEnvironment } from '../Infrastructure/Auth/BackendMode'
import { getApplicationName } from 'react-native-device-info'

export type EnvironmentVariables = {
	environment: AppEnvironment
	publishableKey: string
	apiUrl: string
	appTitle: string
}

export const prodConstants: EnvironmentVariables = {
	environment: 'prod',
	publishableKey: 'pk_live_51L0jyFFtKshfJlzHptjOjSsSF2T8UuavxvGQuFkp68Fi2pPcYvGKDjV1cy5lcNXAS3eMAi4DnQY6UGf54os8Vcyz005ANAmLcL',
	apiUrl: 'https://api.izipoint.io',
	appTitle: getApplicationName(),
}

export const betaConstants: EnvironmentVariables = {
	environment: 'beta',
	publishableKey: 'pk_test_51L0jyFFtKshfJlzHYYaZj26WenqJOzZ32EK7mxDFZp4MIAks7dAnmHzzlDAupDE1L6G40cQR5gOWlGbgLQRbxCLN00rovKOshm',
	apiUrl: 'https://betaapi.izipoint.io',
	appTitle: getApplicationName(),
}
