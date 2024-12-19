import { IDisposable } from '../../Infrastructure/Using'
import { Platform } from 'react-native'
import _BackgroundTimer from 'react-native-background-timer'

export class FunctionalTimer implements IDisposable {

	private handler?: ReturnType<typeof _BackgroundTimer.setInterval>

	constructor(
		readonly interval: number,
		public onTick: () => void,
		public completeCondition: () => boolean,
		public onComplete: () => void = () => null,
	) {
	}

	start = () => {

		if (Platform.OS === 'ios') {
			_BackgroundTimer.start()
		}
		this.handler = _BackgroundTimer.setInterval(() => {

			if (this.completeCondition()) {
				this.stop()
				this.onComplete()
				return
			}

			this.onTick()

		}, this.interval)

		return this
	}

	complete = () => {
		this.completeCondition = () => true
	}

	stop = () => {
		if (this.handler) {
			_BackgroundTimer.clearInterval(this.handler)
			this.handler = undefined
		}
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	dispose = this.stop
}

