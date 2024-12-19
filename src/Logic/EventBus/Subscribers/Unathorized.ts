import { HttpError, MissingCredentialsInStorageError } from '../../../Infrastructure/Exceptions/Errors'

import { Subscriber } from './Subscribers.Types'
import { globalContext } from '../../../DependencyInjection/AppContext'

export const unauthorizedSubscriber: Subscriber = {
	id: Symbol(),
	execute: () => {
		globalContext.preferences.value.forgetCredentials().then(result => result)
		const navigator = globalContext.navigatorRef.value.current
		if (!navigator) {
			return
		}

		navigator.navigate('authorization')
	},
	predicate: event => {
		if (event.result.isRight()) {
			console.log('event.result.isRight()', event.result.isRight())
			return false
		}
		const err = event.result.swap().unsafeCoerce()
		return (
			err instanceof MissingCredentialsInStorageError
			|| err instanceof HttpError && err.isUnauthorized
			|| err instanceof HttpError && err.isRefreshTokenOut
			|| err instanceof HttpError && err.isForbiddenByServer
		)
	},
}
