
export type PurchaseI18n = {
	title: string,
	initialPurchase: {
		qrCodeDescription: string,
		greetings: {
			title: string,
			description: string,
		},
		usageGuide: {
			point_1: string,
			point_2: string,
			point_3: string,
		},
	},
	cancelPurchase: {
		question: string,
		continuePurchase: string,
		cancelPurchase: string,
	},
	purchaseSuccess: {
		gratitude: string,
		scanQr: string
	},
}
