import { action, makeObservable, observable } from 'mobx'

export class CounterInteractor {
	private static readonly defaultStep = 1
	count = 0

	constructor(
		private readonly endCount: number,
		private readonly onCountEnd: () => void,
		private readonly step: number = CounterInteractor.defaultStep,
	) {
		makeObservable(this, {
			count: observable,
			onCount: action,
		})
	}

	onCount = () => {
		this.count += this.step
		if (this.count % this.endCount === 0) {
			this.onCountEnd()
		}
	}
}
