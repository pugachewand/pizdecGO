import { I18n } from '../../I18n/_Logic/I18n'
import { LanguagesKeys } from '../../DependencyInjection/i18nProvider'
import React from 'react'
import { globalContext } from '../../DependencyInjection/AppContext'

export type i18nContextType = {
	i18n: I18n
	toggleLanguageAsync: (val: LanguagesKeys) => void
}


export const i18nContext = React.createContext<i18nContextType>({
	i18n: globalContext.preferences.value.i18n,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	toggleLanguageAsync: (_val: LanguagesKeys) => {},
})

export const useI18n = () => React.useContext(i18nContext)
