import { AppEvent } from '../Event'

export type Subscriber = {
	predicate: (event: AppEvent) => boolean
	execute: (event: AppEvent) => void
	id: symbol
}
