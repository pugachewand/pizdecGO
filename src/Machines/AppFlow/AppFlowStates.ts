
enum AppFlowStates {
  EngineeringMenu = 'engineeringMenu',
  UsbDevicesCheck = 'usbDevicesCheck',
  Init = 'authorization',
  NotReady = 'notReady',
  PurchaseInvitation = 'initialPurchase',
  PurchaseInit = 'purchaseInit',
  BasketFormation = 'cart',
  PurchaseCancel = 'purchaseCancel',
  Payment = 'payment',
  PurchaseSuccess = 'purchaseSuccess',
  PaymentReconciliation = 'paymentReconciliation',
  Support = 'support',
}

export default AppFlowStates;
