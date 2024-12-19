export const toUrlEncoded = (input: object) =>
	Object.keys(input)
		.map(key => {
			const encodedKey = encodeURIComponent(key)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const encodedValue = encodeURIComponent((input as any)[key])
			return `${encodedKey}=${encodedValue}`
		})
		.join('&')
