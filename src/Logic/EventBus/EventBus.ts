import { AppEvent } from './Event'
import { Subscriber } from './Subscribers/Subscribers.Types'

export class EventBus {

	private readonly subscribers = new Map<symbol, Subscriber>()

	constructor(...subscribers: Subscriber[]) {
		subscribers.forEach(s => this.subscribe(s))
	}

	emit = (...events: AppEvent[]) =>
		events.forEach(event =>
			[...this.subscribers.values()]
				.filter(s => s.predicate(event))
				.forEach(s => s.execute(event))
		)

	subscribe = (subscriber: Subscriber) => {
		this.subscribers.set(subscriber.id, subscriber)
	}

	unsubscribe = (id: symbol) => this.subscribers.delete(id)
}
