import { HasValue } from './Types'

export class Transient<T> implements HasValue<T> {
	constructor(private readonly _gen: () => T) {}

	get value() {
		return this._gen()
	}
}
