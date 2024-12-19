import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalStorageMap } from '../../DependencyInjection/Preferences/Preferences.Type'
import { dateReviver } from './SecureStorageFacade'

type Key = keyof LocalStorageMap


export class AsyncStorageFacade {
	static getValue = async <T extends Key>(
		key: T,
	): Promise<LocalStorageMap[T] | null> => {
		const value = await AsyncStorage.getItem(key)
		if (value === null) {
			return null
		}

		return JSON.parse(value, dateReviver) as LocalStorageMap[T]
	}

	static setValueAsync = async <T extends Key>(
		key: T,
		value: LocalStorageMap[T],
	): Promise<string> => {
		const strValue = JSON.stringify(value)
		await AsyncStorage.setItem(key, strValue)
		return strValue
	}

	static deleteValueAsync = async <T extends Key>(key: T): Promise<null> => {
		await AsyncStorage.removeItem(key)
		return null
	}
}
