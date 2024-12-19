import { dateToISOLikeButLocal } from "./DateToLocalISO"

export const getHoursMinutes = (hoursAndMinutes: string | Date) => {
    const date = new Date()
    if (hoursAndMinutes instanceof Date) {
        const date = new Date()
        date.setHours(hoursAndMinutes.getHours())
        date.setMinutes(hoursAndMinutes.getMinutes())
        date.setSeconds(hoursAndMinutes.getSeconds())
        const combinedTime = dateToISOLikeButLocal(date)
        return combinedTime
    }
    const hoursAndMinutesToInt = hoursAndMinutes.replace(/[^0-9:]/g, '').split(':').map(item => parseInt(item))
    if (!Number.isNaN(hoursAndMinutesToInt[0])) {
        if (hoursAndMinutesToInt.length === 1){
            date.setHours(hoursAndMinutesToInt[0])
            date.setMinutes(0)
        }
        else if (hoursAndMinutesToInt.length === 2) {
            date.setHours(hoursAndMinutesToInt[0])
            date.setMinutes(hoursAndMinutesToInt[1])
        }
        else {
            date.setHours(2)
            date.setMinutes(0)
        }
    }
    else {
        date.setHours(2)
        date.setMinutes(0)
    }
    date.setSeconds(0)
    const combinedTime = dateToISOLikeButLocal(date)
    return combinedTime
}