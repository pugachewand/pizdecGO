import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const dateWIthoutUTC = (dateof: Date) => dayjs(dateof).utc(false).format('DD.MM.YYYY')