import { AuthRU } from '../Startup/Auth/Auth.RU'
import { CartRU } from '../Tabs/Cart/Cart.RU';
import { CommonRU } from '../_Common/Common.RU'
import {ErrorTerminalRU} from "../_Common/ErrorTerminal/ErrorTerminal.RU";
import { ErrorViewRU } from '../_Common/ErrorView/ErrorView.RU'
import { HeaderRU } from '../_Common/Header/Header.RU';
import { I18n } from './I18n'
import { NewPurchaseRU } from '../Tabs/NewPurchase/NewPurchase.RU';
import { PaymentRU } from '../../I18n/Tabs/Payment/Payment.RU'
import { PurchaseRU } from '../Tabs/Purchase/Purchase.RU';
import { Transient } from '../../Logic/DI/Transient'
import { WelcomeRU } from '../Startup/Welcome/Welcome.RU'
import { infoRU } from './../Info/Info.RU'
import { SupportRU } from '../Tabs/Support/Support.RU';

export const i18nRU: I18n = {
	common: new Transient(() => CommonRU),
	errorView: new Transient(() => ErrorViewRU),
	errorTerminal: new Transient(() => ErrorTerminalRU),
	header: new Transient(() => HeaderRU),

	welcome: new Transient(() => WelcomeRU),
	auth: new Transient(() => AuthRU),

	info: new Transient(() => infoRU),
	cart: new Transient(() => CartRU),
	newPurchase: new Transient(() => NewPurchaseRU),
	purchase: new Transient(() => PurchaseRU),
	payment: new Transient(() => PaymentRU),
	support: new Transient(() => SupportRU),
}
