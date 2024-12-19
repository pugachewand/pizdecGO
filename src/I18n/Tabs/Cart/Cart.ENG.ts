import {CartI18n} from './Cart.i18n'

export const CartENG: CartI18n = {
  title: 'Purchase',
  cartHeader: {
		title: 'Shopping list',
		description: 'Scan products using a scanner',
	},
  itemsTable: {
		name: 'Name',
		quantity: 'Quantity',
		price: 'Price',
		calories: 'kcal',
    discount: 'Discount',
		totalCost: 'TOTAL: ',
	},
	cancelPurchase: {
		headerText: 'Are you sure you want to cancel your purchase?',
		contentHeaderText: 'If you cancel your purchase, your cart will be cleared',
		contentText: 'Don\'t forget to return the item',
	},
	autoClose: {
		headerText: 'Do you want to continue the purchase?',
		contentHeaderText: 'When the timer expires, the purchase will be canceled',
		contentText: 'To continue purchasing, click on the button',
	},
}
