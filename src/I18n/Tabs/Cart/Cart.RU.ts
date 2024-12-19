import {CartI18n} from './Cart.i18n'

export const CartRU: CartI18n = {
  title: 'Покупка',
  cartHeader: {
		title: 'Список покупок',
		description: 'Отсканируйте товары при помощи сканера',
	},
  itemsTable: {
		name: 'Наименование',
		quantity: 'Количество',
		price: 'Стоимость',
		calories: 'ккал',
    discount: 'Скидка: ',
		totalCost: 'ИТОГО: ',
	},
  cancelPurchase: {
		headerText: 'Вы точно хотите отменить покупку?',
		contentHeaderText: 'При отмене покупки корзина будет очищена',
		contentText: 'Не забудьте вернуть товар',
	},
	autoClose: {
		headerText: 'Вы хотите продолжить покупку?',
		contentHeaderText: 'По истечению таймера покупка будет аннулирована',
		contentText: 'Для продолжения покупки нажмите на кнопку',
	},
}
