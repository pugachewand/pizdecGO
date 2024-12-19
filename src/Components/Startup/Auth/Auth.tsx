import { HeaderBackButton, HeaderBackButtonProps } from '@react-navigation/elements'
import { SafeAreaView } from 'react-native'

import { AuthStore } from './Auth.Store'
import { CustomText } from '../../_Common/CustomText/CustomText';
import { HeaderMode } from '../../_Common/Header/HeaderMode/HeaderMode'
import { LanguageTypes } from '../../../DependencyInjection/i18nProvider'
import { MainNavigatorRoutes } from '../../../EntryPoint/MainNavigator'
import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { i18nContext } from '../../../EntryPoint/Context/i18nContext'
import { observer } from 'mobx-react'
import { AuthStyles as s } from './Auth.Styles'

export type AuthScreenNavigationProps = StackScreenProps<MainNavigatorRoutes, 'auth'>

export type AuthScreenProps = {
	lang?: LanguageTypes
}


const BackButton = observer((props: { store: AuthStore; headerProps: HeaderBackButtonProps; routeParams: AuthScreenProps }) => {

	const { headerProps } = props

	return <HeaderBackButton {...headerProps} labelVisible={false} />
})

@observer
export class Auth extends React.Component<AuthScreenNavigationProps> {
	static contextType = i18nContext
	declare context: React.ContextType<typeof i18nContext>
	private readonly store: AuthStore
	constructor(props: AuthScreenNavigationProps) {
		super(props)
		this.store = new AuthStore(props)
	}

	componentDidMount() {
		const i18n = this.context.i18n.auth.value.registration
		this.store.componentDidMount()

		this.props.navigation.setOptions({
			headerTitle: props =>
				<HeaderMode {...props}>{i18n.title}</HeaderMode>,
			headerLeft: headerProps => <BackButton store={this.store} headerProps={headerProps} routeParams={this.props.route.params} />,
		})

	}

	render() {
		return (
			<SafeAreaView style={s.wrap}>
				<CustomText>
					Auth Screen///////////////////////////
				</CustomText>
			</SafeAreaView>
		)
	}
}
