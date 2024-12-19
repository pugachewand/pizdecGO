import { InfoI18n } from './Info.i18n'

export const infoRU: InfoI18n = {
	registrationSuccess: {
		congratulationsYouRegistered: 'Поздравляем с регистрацией',
		bringCameraToQRCode: 'Для начала покупки, поднесите камеру к QR-коду витрины.',
	},
	bankingCardAdditionSuccess: {
		newCardAttached: 'Новая карта привязана',
		newCardAttachedAndConfirmed: 'Новая карта привязана и подтверждена, все оплаты будут идти с новой карты.',
	},
	purchase: {
		youHaventBoughtAnythingYet: 'Вы пока ничего не купили',
		takeFirstStep: 'Пора сделать первый шаг',
		step1OpenPos: '1. Откройте точку продаж',
		step2ChooseWhatYouWant: '2. Выберите, что хотите',
		step3Pay: '3. Оплатите',
		openDoorButton: 'Открыть дверь',
	},
	purchaseSuccess: {
		thanksForPurchase: 'Спасибо за покупку',
		awaitForReceipt: 'Ожидайте чек',
		selfShop: 'Можете покинуть магазин',
		historyReceipt: 'Онлайн чек будет доступен в меню “История”',
		quit: 'Завершить',
	},
	inAppUpdates: {
		isUnstabilityVersion: 'Данная версия приложения может быть нестабильной.\nМы работаем над выпуском новой версии и скоро предложим на нее перейти.\nПри возникновении ошибок обратитесь в техническую поддержку (меню “Связь”).',
		ios: {
			title: 'Доступно обновление',
			message: 'Хотите выполнить обновление сейчас?',
			immediateMessage: 'Без обновления продолжение работы приложения невозможно.',
			buttonUpgradeText: 'Обновить',
        	buttonCancelText: 'Отмена',
		},
	},
	installApp: {
		firstUncoercedTitle: 'Вы используете старую версия приложения izipoint.',
		secondUncoercedTitle: 'Приложение будет поддерживаться до ',
		thirdUncoercedTitle: 'Скачайте новое улучшенное приложение izipoint lite.',
		firstForcedTitle: 'Эта версия izipoint устарела.',
		secondForcedTitle: 'Нажмите "Скачать" ниже, чтобы загрузить улучшенное приложение izipoint lite.',
		continueToPWA: 'Продолжить в браузере',
		download: 'Скачать новую версию',
		listTitle: 'В новом приложении мы добавили:',
		firstOpportunity: 'авторизацию через Gmail и Apple ID',
		secondOpportunity: 'способы оплаты YandexPay и СБП',
		thirdOpportunity: 'новые алгоритмы взаимодействия с пользователем',
	},
	support: {
		hotlineSupportDescription: 'Наша поддержка всегда на связи: ',
	},
	terminalConnection: {
		connectionWithBankTitle: 'Проверка соединения...',
		connectionWithBankDescription: 'Пожалуйста, подождите. Идёт проверка \nсвязи POS-терминала с банком'
	}
}
