import { action, makeObservable, observable } from 'mobx'

import dayjs from 'dayjs'

export class CountDownInteractor {

	static readonly millisecondsInSecond = 1000

	millisecondsLeft: number

	private endTime: dayjs.Dayjs

	private intervalHandle: ReturnType<typeof setInterval> | null = null

	constructor(
		private readonly cycleMilliseconds: number,
		private readonly onComplete: () => void,
		private readonly interval = CountDownInteractor.millisecondsInSecond,
		private readonly repeat: boolean = false,
	) {
		makeObservable(this, {
			millisecondsLeft: observable,
			setMillisecondsLeft: action,
		})
		this.endTime = this.calcNewCycle(this.cycleMilliseconds)
		this.millisecondsLeft = this.calcMillisecondsLeft()
		this.startTimer()
	}

	setMillisecondsLeft = (millisecondsLeft: number) => {
		this.millisecondsLeft = millisecondsLeft
	}

	invalidate = () => {
		if (this.intervalHandle) {
			clearInterval(this.intervalHandle)
			this.intervalHandle = null
		}
	}

	private readonly calcMillisecondsLeft = () => this.endTime.diff(dayjs(), 'millisecond')

	private readonly calcNewCycle = (ms: number) => dayjs().add(ms, 'millisecond')

	private readonly startTimer = () => {
		this.intervalHandle = setInterval(this.action, this.interval)
		this.action()
	}

	private readonly action = () => {
		this.setMillisecondsLeft(this.calcMillisecondsLeft())
		if (this.millisecondsLeft <= 0) {
			this.onComplete()
			this.invalidate()
			if (this.repeat) {
				this.endTime = this.calcNewCycle(this.cycleMilliseconds)
				this.startTimer()
			}
		}
	}
}
