import { EventBus } from './EventBus'
import { consoleDebugSubscriber } from './Subscribers/ConsoleDebug'
import { unauthorizedSubscriber } from './Subscribers/Unathorized'
import { errorUserAlertSubscriber } from './Subscribers/UserAlert'

export const defaultImplementation = () => new EventBus(
	unauthorizedSubscriber,
	consoleDebugSubscriber,
	errorUserAlertSubscriber,
)
