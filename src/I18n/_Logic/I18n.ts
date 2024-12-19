import {AuthI18n} from '../Startup/Auth/Auth.i18n'
import {CartI18n} from '../../I18n/Tabs/Cart/Cart.i18n'
import {CommonI18n} from '../_Common/Common.i18n'
import {ErrorTerminalI18n} from '../_Common/ErrorTerminal/ErrorTerminal.i18n'
import {ErrorViewI18n} from '../_Common/ErrorView/ErrorView.i18n'
import {HasValue} from '../../Logic/DI/Types'
import {HeaderI18n} from '../../I18n/_Common/Header/Header.i18n'
import {InfoI18n} from '../Info/Info.i18n'
import {NewPurchaseI18n} from '../Tabs/NewPurchase/NewPurchase.i18n'
import {PaymentI18n} from '../Tabs/Payment/Payment.i18n'
import {PurchaseI18n} from '../Tabs/Purchase/Purchase.i18n'
import {WelcomeI18n} from '../Startup/Welcome/Welcome.i18n'
import {SupportI18n} from '../Tabs/Support/Support.i18n'

export type I18n = {
  common: HasValue<CommonI18n>
  errorView: HasValue<ErrorViewI18n>
  errorTerminal: HasValue<ErrorTerminalI18n>
  header: HasValue<HeaderI18n>

  welcome: HasValue<WelcomeI18n>
  auth: HasValue<AuthI18n>

  info: HasValue<InfoI18n>
  cart: HasValue<CartI18n>
  purchase: HasValue<PurchaseI18n>
  newPurchase: HasValue<NewPurchaseI18n>
  payment: HasValue<PaymentI18n>
  support: HasValue<SupportI18n>
}
