
export type CartI18n = {
	title: string
	cartHeader: {
		title: string,
		description: string,
	},
	itemsTable: {
		name: string,
		quantity: string,
		price: string,
		calories: string,
		discount: string,
		totalCost: string,
	},
	cancelPurchase: {
		headerText: string,
		contentHeaderText: string,
		contentText: string,
	},
	autoClose: {
		headerText: string,
		contentHeaderText: string,
		contentText: string,
	},
}
