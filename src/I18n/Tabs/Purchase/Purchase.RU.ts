import {PurchaseI18n} from './Purchase.i18n'

export const PurchaseRU: PurchaseI18n = {
  title: 'Покупка',
  initialPurchase: {
    qrCodeDescription: 'Для покупки\nчерез приложение\nотсканируйте QR код',
    greetings: {
			title: 'Добро пожаловать',
			description: 'Самостоятельные покупки быстро и просто',
		},
		usageGuide: {
			point_1: 'Нажмите кнопку “Начать”',
			point_2: 'Отсканируйте выбранные товары',
			point_3: 'Нажмите кнопку “Оплатить”',
		},
  },
	cancelPurchase: {
		question: 'Вы уверены, что хотите отменить покупку?',
		continuePurchase: 'Продолжить покупку',
		cancelPurchase: 'Отменить покупку',
	},
	purchaseSuccess: {
		gratitude: 'Спасибо за покупку',
		scanQr: 'Отсканируйте QR код, чтобы посмотреть чек'
	},
}
