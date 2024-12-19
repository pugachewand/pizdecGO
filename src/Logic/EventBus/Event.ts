import { AppError } from '../../Infrastructure/Exceptions/Errors'
import { DropdownAlertType } from 'react-native-dropdownalert'
import { Either } from 'purify-ts/Either'

export type EventLevel = 'debug' | 'info' | 'warning' | 'error'

export type AnalyticsCategory = 'Errors' | 'ScreenTransitions' | 'SelectiveFunctionality' | 'Click' | 'IgnoreEvent' | 'ReadFromDeviceStorage'


export type UserAlert = {
	title: string
	description: string
	level: EventLevel
}

export type AppEvent = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: Either<AppError, any>
	successUserAlert?: UserAlert
	successLogLevel?: EventLevel
	payload?: object
	suppressUserError?: boolean
	analyticsCategory: AnalyticsCategory
	moduleName: string
	screenName: string
	functionalityName: string
	requestProcessingTime?: number
	requestDate?: string
	responseDate?: string
	requestUrl?: string
	requestBody?: string
	requestMethod?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	eventData?: any
	additional?: string
}

export const mapEventLevelToDropDown = (level: EventLevel): DropdownAlertType => {
	switch (level) {
		case 'error':
			return 'error'
		case 'warning':
			return 'warn'
		case 'info':
		case 'debug':
			return 'info'
	}
}

