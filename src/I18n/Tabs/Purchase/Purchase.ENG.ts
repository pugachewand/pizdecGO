import {PurchaseI18n} from './Purchase.i18n'

export const PurchaseENG: PurchaseI18n = {
  title: 'Purchase',
  initialPurchase: {
    qrCodeDescription: 'To make purchase\nthrough the app,\nscan the QR code',
    greetings: {
      title: 'Welcome',
      description: 'Self-shopping quickly and easily',
    },
    usageGuide: {
      point_1: 'Click the “Start” button',
      point_2: 'Scan selected products',
      point_3: 'Click the “Pay” button',
    },
  },
  cancelPurchase: {
    question: 'Are you sure you want to cancel your purchase?',
    continuePurchase: 'Continue purchasing',
    cancelPurchase: 'Cancel purchase',
  },
  purchaseSuccess: {
    gratitude: 'Thank you for your purchase',
    scanQr: 'Scan the QR code to view your receipt',
  },
}
