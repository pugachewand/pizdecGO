export const GetFormattedDate = (date: Date) => {
	const dateof = date.toLocaleDateString()
	const hours = date.toLocaleTimeString().replace(/:((\d{2}) (?=[AP]M))|(:\d{2}$)/, ' ')
	return  `${dateof}  ${hours}`
}