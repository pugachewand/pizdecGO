import { AuthENG } from '../Startup/Auth/Auth.ENG'
import { CartENG } from '../Tabs/Cart/Cart.ENG';
import { CommonENG } from '../_Common/Common.ENG'
import {ErrorTerminalENG} from "../_Common/ErrorTerminal/ErrorTerminal.ENG";
import { ErrorViewENG } from '../_Common/ErrorView/ErrorView.ENG'
import { HeaderENG } from '../_Common/Header/Header.ENG';
import { I18n } from './I18n'
import { NewPurchaseENG } from '../Tabs/NewPurchase/NewPurchase.ENG';
import { PaymentENG } from '../../I18n/Tabs/Payment/Payment.ENG'
import { PurchaseENG } from '../Tabs/Purchase/Purchase.ENG';
import { Transient } from '../../Logic/DI/Transient'
import { WelcomeENG } from '../Startup/Welcome/Welcome.ENG'
import { infoENG } from './../Info/Info.ENG'
import { SupportENG } from '../Tabs/Support/Support.ENG';

export const i18nENG: I18n = {
	common: new Transient(() => CommonENG),
	errorView: new Transient(() => ErrorViewENG),
	errorTerminal: new Transient(() => ErrorTerminalENG),
	header: new Transient(() => HeaderENG),

	welcome: new Transient(() => WelcomeENG),
	auth: new Transient(() => AuthENG),

	info: new Transient(() => infoENG),
	cart: new Transient(() => CartENG),
	newPurchase: new Transient(() => NewPurchaseENG),
	purchase: new Transient(() => PurchaseENG),
	payment: new Transient(() => PaymentENG),
	support: new Transient(() => SupportENG),

}
