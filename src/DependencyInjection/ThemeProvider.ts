import { HasValue } from '../Logic/DI/Types'
import { Style } from '@brand/Style'
import { Theme } from '../Styles/Theme/_Common/Theme.Types'

export class ThemeProvider implements HasValue<Theme> {

	theme: Theme
	constructor() {
		this.theme = Style
	}

	get value() {
		return this.theme
	}
}
