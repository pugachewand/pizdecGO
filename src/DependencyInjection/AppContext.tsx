import 'dayjs/locale/ru'
import 'dayjs/locale/el'
import 'dayjs/locale/fr'
import 'dayjs/locale/pt'
import 'dayjs/locale/uk'
import 'dayjs/locale/es'
import 'dayjs/locale/lv'

import { AsyncStorageAuthPreferencesFactory, AsyncStoragePreferencesFactory } from './Preferences/AsyncStoragePreferencesFactory'

import DropdownAlert from 'react-native-dropdownalert'
import { GlobalContext } from './GlobalContext.Types'
import { Lazy } from '../Logic/DI/Lazy'
import { MainNavigatorRoutes } from 'EntryPoint/MainNavigator'
import { NavigationContainerRef } from '@react-navigation/native'
import { PreferencesStore } from './Preferences/Preferences.Store'
import React from 'react'
import { ThemeProvider } from './ThemeProvider'
import { appRestRepos } from './RestReposProvider'
import { defaultImplementation } from '../Logic/EventBus/Implementations'

type GlobalContextFactory = () => GlobalContext


export const appGlobalContextFactory: GlobalContextFactory = () => {

	const lazyPreferences = new Lazy(() => {
		const preferencesFactory = new AsyncStoragePreferencesFactory()
		const authFactory = new AsyncStorageAuthPreferencesFactory()
		return new PreferencesStore(preferencesFactory, authFactory)
	})

	return {
		alertDropdownRef: new Lazy(() => React.createRef<DropdownAlert>()),
		navigatorRef: new Lazy(() => React.createRef<NavigationContainerRef<MainNavigatorRoutes>>()),
		eventBus: new Lazy(defaultImplementation),
		preferences: lazyPreferences,
		restRepos: appRestRepos,
		theme: new ThemeProvider(),
	}
}

export const globalContext = appGlobalContextFactory()

export const resetContext = () => module.exports.globalContext = appGlobalContextFactory()
