import { View } from 'react-native'

import { ModeBadgeStore } from './ModeBadge.Store'
import React from 'react'
import { StyledButton } from '../../_Common/Button/StyledButton'
import { i18nContext } from '../../../EntryPoint/Context/i18nContext'
import { observer } from 'mobx-react'
import { ModeBadgeStyles as s } from './ModeBadge.Styles'

@observer
export class ModeBadge extends React.Component {
	static contextType = i18nContext
	declare context: React.ContextType<typeof i18nContext>

	store = new ModeBadgeStore()

	render() {
		const { modeText } = this.store
		return <View style={s.container}>
			{ modeText
				&& <StyledButton title={modeText} buttonStyle={s.buttonBackground} textStyle={s.buttonText} />
			}
		</View>
	}

}
