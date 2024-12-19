import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

import { LocalStorageMap } from '../../DependencyInjection/Preferences/Preferences.Type'
import { isIso8601 } from '../Date/IsIso8601'
import isString from 'lodash-es/isString'

type Key = keyof LocalStorageMap

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateReviver = (_: string, value: any) => {
	if (isString(value) && isIso8601(value)) {
		return new Date(value)
	}
	return value
}

export class SecureStorageFacade {

	static getValueAsync = async <T extends Key>(
		key: T,
	): Promise<LocalStorageMap[T] | null> => {
		const exist = await RNSecureStorage.exists(key)
		if (exist) {
			const value = await RNSecureStorage.get(key)
			if (value === null) {
				return null
			}

			return JSON.parse(value, dateReviver)
		}
		return null
	}

	static setValue = <T extends Key>(
		key: T,
		value: LocalStorageMap[T],
	): Promise<string | null> => RNSecureStorage.set(key, JSON.stringify(value), { accessible: ACCESSIBLE.WHEN_UNLOCKED })

	static deleteValueAsync = async <T extends Key>(key: T): Promise<string | null> => {
		const exists = await RNSecureStorage.exists(key)
		if (!exists) {
			return null
		}
		return RNSecureStorage.remove(key)
	}
}
