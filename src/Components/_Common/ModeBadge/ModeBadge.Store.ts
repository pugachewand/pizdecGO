import { computed, makeObservable } from 'mobx'
import { globalContext } from '../../../DependencyInjection/AppContext'

export class ModeBadgeStore {

	private static readonly substringEndIndex = 1

	private readonly preferences = globalContext.preferences.value

	get modeText() {
		return this.preferences.environmentVariables.environment.substring(0, ModeBadgeStore.substringEndIndex).toUpperCase()
	}

	constructor() {
		makeObservable(this, {
			modeText: computed,
		})
	}
}
