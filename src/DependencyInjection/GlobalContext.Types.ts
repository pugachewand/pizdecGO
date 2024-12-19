import { AuthRepo } from '../Logic/RestApi/Auth/AuthRepo'
import DropdownAlert from 'react-native-dropdownalert'
import { EventBus } from '../Logic/EventBus/EventBus'
import { HasValue } from '../Logic/DI/Types'
import { IPreferences } from './Preferences/Preferences.Type'
import { MainNavigatorRoutes } from 'EntryPoint/MainNavigator'
import { NavigationContainerRef } from '@react-navigation/native'
import { Theme } from '../Styles/Theme/_Common/Theme.Types'

export type RestRepos = {
	auth: HasValue<AuthRepo>
}

export type GlobalContext = {
	navigatorRef: HasValue<React.RefObject<NavigationContainerRef<MainNavigatorRoutes>>>
	alertDropdownRef: HasValue<React.RefObject<DropdownAlert>>
	eventBus: HasValue<EventBus>
	preferences: HasValue<IPreferences>
	restRepos: RestRepos
	theme: HasValue<Theme>
}
