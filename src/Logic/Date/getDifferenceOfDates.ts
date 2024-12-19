export const getResponseSeconds = (responseDate: Date | undefined, requestDate: Date | undefined) => {
	const milliseconds = 1000
	if (responseDate !== undefined && requestDate !== undefined) {
		return Math.abs((responseDate.getTime() - requestDate.getTime()) / milliseconds)
	}
	return -1
}
