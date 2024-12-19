import { DefaultTheme } from '@react-navigation/native'
import { globalContext } from '../../DependencyInjection/AppContext'

const theme = globalContext.theme.value
export const navigationContainerTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: theme.colors.backgroundColor,
		border: 'transparent',
		notification: 'transparent',
	},
}
