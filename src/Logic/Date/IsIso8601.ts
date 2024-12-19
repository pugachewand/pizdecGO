import dayjs from 'dayjs'

const minAcceptableThreshold = 10
const maxAcceptableThreshold = 30

const pattern = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([\sT]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([,.]\d+(?!:))?)?(\17[0-5]\d([,.]\d+)?)?([Zz]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/


export const isIso8601 = (input: string) =>
	input.length > minAcceptableThreshold &&
	input.length < maxAcceptableThreshold &&
	pattern.test(input) &&
	dayjs(input).isValid()
