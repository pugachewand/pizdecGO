
export type IDisposable = {
	dispose: () => void
}

type Initializer = () => IDisposable
type Action = (arg: IDisposable) => void

export const using = (init: Initializer) => {

	const disposable = init()
	return (action: Action) => {
		try {
			action(disposable)
		}
		finally {
			disposable.dispose()
		}
	}
}
