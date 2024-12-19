enum AppFlowEvents {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CANCEL = 'CANCEL',
  START_PURCHASE = 'START_PURCHASE',
  START_PAYMENT = 'START_PAYMENT',
  REMOVE_PRODUCT = 'REMOVE_PRODUCT',
  REMOVE_PRODUCTS = 'REMOVE_PRODUCTS',
  ADD_PRODUCT = 'ADD_PRODUCT',
  RETURN = 'RETURN',
  REPEAT = 'REPEAT',
  START_PAYMENT_RECONCILIATION = 'START_PAYMENT_RECONCILIATION',
  RETURN_TO_ENGINEERING_MENU = 'RETURN_TO_ENGINEERING_MENU',
  PURCHASE_INVITATION = 'PURCHASE_INVITATION',
  UPDATE_BASKET_PRODUCT_ITEMS = 'UPDATE_BASKET_PRODUCT_ITEMS',
}

export default AppFlowEvents;