import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import AppFlowMachineContextProvider from '../Machines/AppFlow/AppFlowMachineContextProvider';
import { AuthScreenProps } from '../Components/Startup/Auth/Auth'
import { Cart } from '../Tabs/Cart/Cart';
import CustomAlertModal from '../Components/_Common/Modal/CustomAlertModal';
import DropdownAlert from 'react-native-dropdownalert';
import { EngineeringMenu } from '../Components/Startup/EngineeringMenu/EngineeringMenu';
import { HeaderRight } from '../Components/_Common/Header/HeaderRight/HeaderRight';
import { HeaderTitle } from '@react-navigation/elements'
import { InitialPurchase } from '../Tabs/InitialPurchase/InitialPurchase'
import { LaunchScreenNavigatorRoot } from '../Components/Startup/LaunchScreen/LaunchScreen'
import { LogoIcon } from '../Brands/iziGo/LogoIcon';
import { ModalProvider } from 'react-native-use-modal';
import { NavigationContainer } from '@react-navigation/native'
import { NotReady } from '../Tabs/NotReady/NotReady';
import { Payment } from '../Tabs/Payment/Payment';
import { PaymentReconciliation } from '../Tabs/PaymentReconciliation/PaymentReconciliation';
import PurchaseCancel from '../Tabs/PurchaseCancel/PurchaseCancel';
import PurchaseInit from '../Tabs/PurchaseInit/PurchaseInit';
import { PurchaseSuccess } from '../Tabs/PurchaseSuccess/PurchaseSuccess';
import React from 'react'
import { Support } from '../Tabs/Support/Support';
import { UsbDevicesCheck } from '../Components/Startup/UsbDevicesCheck/UsbDevicesCheck';
import { globalContext } from '../DependencyInjection/AppContext'
import { navigationContainerTheme } from '../Styles/Theme/NavigationContainerTheme'
import { observer } from 'mobx-react'

export type MainNavigatorRoutes = {
	engineeringMenu: undefined
	usbDevicesCheck: undefined
	authorization: undefined
	auth: AuthScreenProps
	support: undefined
	initialPurchase: undefined
	cart: undefined
	purchaseInit: undefined
	purchaseCancel: undefined
	payment: undefined
	purchaseSuccess: undefined
	notReady: undefined
	paymentReconciliation: undefined
}
export type MainNavigatorRoutesProps<T extends keyof MainNavigatorRoutes> =
  StackScreenProps<MainNavigatorRoutes, T>;
const stack = createStackNavigator<MainNavigatorRoutes>()

@observer
export class MainNavigator extends React.Component {
	private readonly dropdownRef = globalContext.alertDropdownRef.value
	private readonly theme = globalContext.theme.value

	private readonly renderContent = () =>
		<NavigationContainer theme={navigationContainerTheme}
			ref={globalContext.navigatorRef.value}
			>
			<AppFlowMachineContextProvider>
				<ModalProvider>
				<stack.Navigator
					initialRouteName='engineeringMenu'
					screenOptions={() => ({
						animationEnabled: false,
						headerBackTitleVisible: false,
						headerTitleAlign: 'center',
						headerTintColor: this.theme.colors.default,
						header: undefined,
						headerStyle: this.theme.headerStyle,
					})}>
					<stack.Screen
						name='engineeringMenu'
						component={EngineeringMenu}
						options={{ headerShown: false, headerStyle: this.theme.headerStyle }}
					/>
					<stack.Screen
						name='usbDevicesCheck'
						component={UsbDevicesCheck}
						options={{ headerShown: false, headerStyle: this.theme.headerStyle }}
					/>
					<stack.Screen
						name='authorization'
						component={LaunchScreenNavigatorRoot}
						options={{ headerShown: false, headerStyle: this.theme.headerStyle }}
					/>
					<stack.Screen name='initialPurchase' component={InitialPurchase} options={({ navigation }) => ({
						headerTitleAlign: 'left',
						headerStyle: this.theme.headerStyle,
						headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
						headerRight: () => <HeaderRight navigation={navigation} />,
						headerLeft: ()=> null,
					})}/>
					<stack.Screen name='notReady' component={NotReady} options={({ navigation }) => ({
						headerTitleAlign: 'left',
						headerStyle: this.theme.headerStyle,
						headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
						headerRight: () => <HeaderRight navigation={navigation} />,
						headerLeft: ()=> null,
					})}/>
					<stack.Screen name='purchaseInit' component={PurchaseInit}
					options={({ navigation }) => ({
						headerTitleAlign: 'left',
						headerStyle: this.theme.headerStyle,
						headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
						headerLeft: ()=> null,
					})}
					/>
					<stack.Screen name='purchaseCancel' component={PurchaseCancel}
					options={({ navigation }) => ({
						headerTitleAlign: 'left',
						headerStyle: this.theme.headerStyle,
						headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
						headerLeft: ()=> null,
					})}
					/>
					<stack.Screen name='payment' component={Payment}
					options={({ navigation }) => ({
						headerTitleAlign: 'left',
						headerStyle: this.theme.headerStyle,
						headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
						headerRight: () => <HeaderRight navigation={navigation} />,
						headerLeft: ()=> null,
					})}
					/>
					<stack.Screen name='purchaseSuccess' component={PurchaseSuccess}
					options={({ navigation }) => ({
						headerTitleAlign: 'left',
						headerStyle: this.theme.headerStyle,
						headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
						headerLeft: ()=> null,
						headerRight: () => <HeaderRight navigation={navigation} />,
					})}
					/>
					<stack.Screen
						name='cart'
						component={Cart}
						options={({ navigation }) => ({
							headerTitleAlign: 'left',
							headerStyle: this.theme.headerStyle,
							headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
							headerRight: () => <HeaderRight navigation={navigation} />,
							headerLeft: ()=> null,
						})}
					/>
					<stack.Screen
						name='support'
						component={Support}
						options={{
							headerTitleAlign: 'left',
							headerStyle: this.theme.headerStyle,
							headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
							headerLeft: ()=> null,
						}}
					/>
					<stack.Screen
						name='paymentReconciliation'
						component={PaymentReconciliation}
						options={{
							headerTitleAlign: 'left',
							headerStyle: this.theme.headerStyle,
							headerTitle: props => <HeaderTitle {...props}><LogoIcon /></HeaderTitle>,
							headerLeft: ()=> null,
						}}
					/>
				</stack.Navigator>
				</ModalProvider>
				</AppFlowMachineContextProvider>
		</NavigationContainer>
	render() {
		return (
			<>
				{this.renderContent()}
				<DropdownAlert ref={this.dropdownRef} updateStatusBar={true} inactiveStatusBarBackgroundColor={this.theme.navigation.statusBarColor} />
				<CustomAlertModal ref={this.dropdownRef}/>
			</>
		)
	}
}
