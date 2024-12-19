import { HasValue } from './Types'

export class Lazy<T> implements HasValue<T> {
	private _value: T | null = null

	constructor(private readonly _gen: () => T) {}

	get value(): T {
		if (this._value === null) {
			this._value = this._gen()
		}

		return this._value
	}
}
