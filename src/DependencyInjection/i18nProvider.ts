import { I18n } from '../I18n/_Logic/I18n'
import { i18nENG } from '../I18n/_Logic/i18n.ENG'
import { i18nRU } from '../I18n/_Logic/I18n.RU'


export type LanguageTypes = 'en' | 'ru' |null

/* eslint-disable no-restricted-syntax, no-shadow */
export enum LANGUAGES {
	en = 'English',
	ru = 'Русский',
}

export type LanguagesKeys = keyof typeof LANGUAGES

export const i18nProvider =  (lng: LanguagesKeys | null): I18n => {
	switch (lng) {
		case 'en': return i18nENG
		default: return i18nRU
	}
}
