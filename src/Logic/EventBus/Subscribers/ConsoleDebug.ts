import { EventLevel } from '../Event'
import { HttpError } from '../../../Infrastructure/Exceptions/Errors'
import { Subscriber } from './Subscribers.Types'

/* eslint-disable no-console */


export const consoleDebugSubscriber: Subscriber = {
	id: Symbol(),
	predicate: event => __DEV__ && event.successLogLevel !== undefined && ['error', 'info', 'warning'].includes(event.successLogLevel)
		|| event.result.isLeft(),
	execute: event => {
		const level: EventLevel = event.result.isLeft()
			? 'error'
			: event.successLogLevel
				? event.successLogLevel
				: 'debug'

		console.log(`[${level}] ${event.functionalityName}`)
		if (event.payload) {
			console.log('Payload: ')
			console.log(event.payload)
		}
		if (event.result) {
			console.log('Result: ')
			console.log(JSON.stringify(event.result))
		}
		if (event.result.isRight() && event.successUserAlert) {
			console.log('Message to user: ')
			console.log(event.successUserAlert.title)
			console.log(event.successUserAlert.description)
		}
		if (event.result.isLeft()) {
			console.log('error')
			const error = event.result.swap().unsafeCoerce()
			if (error instanceof HttpError) {
				const httpError: HttpError = error
				console.log('request')
				console.log(httpError.axiosError.config?.data)
				console.log('response')
				console.log(httpError.axiosError.response?.data)
				console.log(httpError.axiosError.response?.status)
			}
			else {
				console.log(JSON.stringify(error))
			}
		}
	},
}
