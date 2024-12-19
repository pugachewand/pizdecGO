export const valueAsArray = <T>(value: T | T[] | undefined | null): T[] => {
	if (Array.isArray(value)) {
		return value
	}

	if (value) {
		return [value]
	}

	return []
}
