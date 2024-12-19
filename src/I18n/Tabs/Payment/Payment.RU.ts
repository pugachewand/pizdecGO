import {PaymentI18n} from './Payment.i18n'

export const PaymentRU: PaymentI18n = {
	payment: {
		header: 'Оплатите покупку',
		description: 'Следуйте инструкциям на терминале',
		paymentLoading: 'Обработка платежа',
		paymentError: 'Оплата не удалась',
		paymentErrorDescription: 'К сожалению, ваш платеж не обработан:',
		defaultPaymentErrorMessage: '"Не удалось установить соединение с POS-терминалом"',
	},
	autoClose: {
		headerText: 'Вы хотите продолжить оплату?',
		contentHeaderText: 'По истечению таймера процесс оплаты будет прерван',
		contentText: 'Для продолжения оплаты нажмите на кнопку',
	},
  paymentError: {
    success: 'Операция прошла успешно.',
    failed: 'Операция не удалась.',
    noLinkingPoint: 'Не задан шлюз для привязки банковских карт.',
    invalidPaymentData: 'Не указаны данные банковской карты или криптограмма.',
    noPaymentService: 'Не указан платежный шлюз для бренда.',
    internalError: 'Внутренняя ошибка сервера.',
    integrationError: 'Возникла ошибка при вызове метода платежного шлюза.',
    transportError: 'Возникла сетевая ошибка при вызове метода платежного шлюза.',
    referToCardIssuer: 'Отказ эмитента проводить онлайн-операцию.',
    invalidMerchant: 'Отказ эмитента проводить онлайн-операцию.',
    pickUpCard: 'Карта утеряна.',
    doNotHonor: 'Отказ эмитента без объяснения причин.',
    error: 'Отказ сети проводить операцию или неправильный CVV-код.',
    invalidTransaction: 'Карта не предназначена для онлайн-платежей.',
    amountError: 'Слишком маленькая или слишком большая сумма операции.',
    invalidCardNumber: 'Некорректный номер карты.',
    noSuchIssuer: 'Эмитент не найден.',
    transactionError: 'Отказ эмитента без объяснения причин.',
    formatError: 'Ошибка на стороне эквайера — неверно сформирована транзакция.',
    bankNotSupportedBySwitch: 'Неизвестный эмитент карты.',
    expiredCardPickup: 'Истек срок утери карты.',
    suspectedFraud: 'Отказ эмитента — подозрение на мошенничество.',
    restrictedCard: 'Карта не предназначена для платежей. Платежи для этой карты запрещены.',
    lostCard: 'Карта потеряна.',
    stolenCard: 'Карта украдена.',
    insufficientFunds: 'Недостаточно средств на карте.',
    expiredCard: 'Карта просрочена или неверно указан срок действия.',
    transactionNotPermitted: 'Ограничение на карте.',
    suspectedFraudDecline: 'Транзакция была отклонена банком по подозрению в мошенничестве.',
    securityViolation: 'Карта заблокирована из-за нарушений безопасности.',
    exceedWithdrawFrequency: 'Превышен лимит операций по карте.',
    incorrectCvv: 'Неверно указан код CVV.',
    timeout: 'Эмитент недоступен. Превышено время ожидания.',
    cannotReachNetwork: 'Эмитент недоступен. Сеть недоступна.',
    systemError: 'Ошибка банка-эквайера или сети.',
    unableToProcess: 'Операция не может быть обработана по прочим причинам.',
    authenticationFailed: '3-D Secure авторизация не пройдена.',
    authenticationUnavailable: '3-D Secure авторизация недоступна.',
    antiFraud: 'Лимиты эквайера на проведение операций. ',
    AuthenticationRequired: 'Эта карта требует аутентификации.',
    CardNotSupported: 'Карта не поддерживает этот тип покупки.',
    CurrencyNotSupported: 'Карта не поддерживает указанную валюту.',
    DuplicateTransaction: 'Совсем недавно была отправлена транзакция с идентичной суммой и данными карты.',
    IncorrectPin: 'Введен неверный PIN-код.',
    IncorrectPostalCode: 'Почтовый индекс указан неверно.',
    InvalidAccount: 'Карта или счет, к которому привязана карта, недействительны.',
    ExpirationDateInvalid: 'Срок действия карты недействителен.',
    MerchantBlacklist: 'Платеж был отклонен, поскольку он соответствует значению в черном списке',
    PinRequired: 'Карта была отклонена, так как для нее требуется PIN-код.',
    PinTryExceeded: 'Превышено допустимое количество попыток ввода PIN-кода.',
    TestmodeDecline: 'Был использован номер тестовой карты Stripe.',
    //pos terminal error
    posTerminalFailed: 'Ошибка терминала.\nПовторите оплату или обратитесь за помощью в нашу поддержку',
		emergencyCancel: 'Произошла экстренная отмена терминала',
		noConnection: 'Нет соединения терминала',
		operationAborted: 'Операция была прервана',
		denied: 'Операция была отклонена',
  },
  primiKartuStatusCode: {
    approved: 'Оплата прошла успешно',
		approved_0: 'Присылается в случае удачного выполнения финансовой транзакции если ответ хоста содержит баланс',	//Approved balances available	Присылается в случае удачного выполнения финансовой транзакции если ответ хоста содержит баланс
		approved_1: 'Присылается в случае удачного выполнения финансовой транзакции',	//Approved no balances available	Присылается в случае удачного выполнения финансовой транзакции
		approved_2: 'Одобрено. Требуется дополнительная идентификация личности клиента (необходимо проверить документ удостоверяющий личность - паспорт и т.п.)',	//Approved additional identification requested	Одобрено. Требуется дополнительная идентификация личности клиента (необходимо проверить документ удостоверяющий личность - паспорт и т.п.)
		approved_3: 'Одобрено. Требуется дополнительный запрос транзакции с результатом выполнения работы микропроцессорной карты.',	//Approved script processing result required	Одобрено. Требуется дополнительный запрос транзакции с результатом выполнения работы микропроцессорной карты.
		approved_4: 'Административная транзакция выполнена успешно',	//Approved administrative transaction	Административная транзакция выполнена успешно
		approved_5: 'Авторизация на меньшую сумму',	//Approved for a lesser amount	Авторизация на меньшую сумму
		generalFailed: 'Финансовую транзакцию выполнить не удалось',	//General	Финансовую транзакцию выполнить не удалось
		expiredCard_0: 'Карта просрочена',	//Expired card	Карта клиента просрочена
		numberOfPinTriesExceede: 'Превышено число попыток ввода PIN',	//Number of PIN tries exceeded	Превышено число попыток ввода PIN
		noSharingAllowed: 'Не удалось маршрутизировать транзакцию',	//No sharing allowed	Не удалось маршрутизировать транзакцию
		invalidTransaction: 'Транзакция имеет некорректные атрибуты или данная операция на данном терминале не разрешена',	//Invalid transaction	Транзакция имеет некорректные атрибуты или данная операция на данном терминале не разрешена
		transactionNotSupported: 'Запрашиваемая операция не поддерживается хостом',	//Transaction not supported by institution	Запрашиваемая операция не поддерживается хостом
		lostOrStoleCard: 'Карта имеет статус "потеряна" или "украдена"',	//Lost or stolen card	Карта клиента имеет статус "потеряна" или "украдена"
		invalidCardStatus: 'Карта имеет неправильный статус', //Invalid card status	Карта клиента имеет неправильный статус
		retrictedStatus: 'Карта имеет ограниченные возможности',	//Restricted status	Карта клиента имеет ограниченные возможности
		accountNotFound: 'Не найден вендор с указанным номером счета',	//Account not found	Не найден вендор с указанным номером счета
		wrongCustomerInformation: 'Неверное количество информационных полей для заданного вендора',	//Wrong customer information for payment	Неверное количество информационных полей для заданного вендора
		customerInfFormatError: 'Неверный формат информационного поля платежа.',	//Customer information format error	Неверный формат информационного поля платежа.
		prepaidCodeNotFound: 'Не найден prepaid-код на указанную сумму',	//Prepaid Code not found	Не найден prepaid-код на указанную сумму
		badTrackInformation: 'Карта содержит неверную информацию',	//Bad track information	Track2 карты клиента содержит неверную информацию
		badMessageEdit: 'Неверный формат сообщения (не хватает полей транзакции или поле неправильно заполнено)',	//Bad message edit	Неверный формат сообщения (не хватает полей транзакции или поле неправильно заполнено)
		unableToAuth: 'Невозможно авторизовать',	//Unable to authorize	Невозможно авторизовать
		invalidCreditPan: 'Неверный PAN карты получателя перевода',	//Invalid credit PAN	Неверный PAN карты получателя перевода
		insufficientFunds: 'Недостаточно средств для оплаты',	//Insufficient funds	На счете клиента не хватает средств
		dublicateTransactionReceived: 'Произошло дублирование транзакции. Данная ситуация может возникнуть в случае если поле заголовка транзакции "Transmission number" повторяется.',	//Duplicate transaction received	Произошло дублирование транзакции. Данная ситуация может возникнуть в случае если поле заголовка транзакции "Transmission number" повторяется.
		maxNumberOfTimesUsed: 'Превышение количества использований карты клиента за определенный промежуток времени',	//Maximum number of times used	Превышение количества использований карты клиента за определенный промежуток времени
		balanceNotAllowed: 'Невозможно выдать баланс',	//Balance not allowed	Невозможно выдать баланс
		amountOverMax: 'Превышение лимита по сумме',	//Amount over maximum	Превышение лимита по сумме
		unableToProcess: 'Невозможно провести транзакцию',	//Unable to process	Невозможно провести транзакцию
		unableToAuthCallToIssuer: 'Невозможно авторизовать',	//Unable to authorize - call to issuer	Невозможно авторизовать - требуется телефонный запрос авторизации транзакции у эмитента (Referral service)
		cardNotSupported: 'Данный тип карт не поддерживается',	//Card not supported	Данный тип карт не поддерживается
		transactionDublicated: 'Транзакция уже существует',	//Transaction dublicated	Транзакция уже существует
		cardNotFound: 'Карта не найдена',	//Card not found	Карта не найдена
		UIDNotFound: 'Внешний идентификатор карты не найден',	//UID not found	Внешний идентификатор карты не найден
		invalidAccount: 'Неправильный счет клиента',	//Invalid account	Неправильный счет клиента
		inCorretPin: 'Неправильный PIN',	//Incorrect PIN	Неправильный PIN
		invalidAdvanceAmount: 'Некорректная сумма',	//Invalid advance amount	Некорректная сумма
		invalidTransactionCode: 'Неверный код транзакции',	//Invalid transaction code	Неверный код транзакции
		badCAVV: 'Неверное значение CAVV',	//Bad CAVV	Неверное значение CAVV
		badCAVV2: 'Неверное значение CVV2',	//Bad CVV2	Неверное значение CVV2
		notFoundOriginalTransactionSlip: 'Не найдена оригинальная транзакция для слипа',	//Original transaction not found for slip	Не найдена оригинальная транзакция для слипа
		slipAlreadyReceived: 'Слип принимается повторно',	//Slip already received	Слип принимается повторно
		weakPin: 'Новый PIN является "слабым" ',	//Weak PIN	Новый PIN является "слабым" (т.е. легкоугадываемым)
		//600	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
		//699	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
		formatError: 'Ошибка формата',	//Format error	Ошибка формата
		notFoundOriginalTransactionReverse: 'Не найдена оригинальная транзакция для реверса',	//Original transaction not found for reverse	Не найдена оригинальная транзакция для реверса
		invalidCloseTransaction: 'Неверная операция закрытия периода (пакета смены дня)',	//Invalid close transaction	Неверная операция закрытия периода (пакета смены дня)
		transactionTimeout: 'Произошёл тайм-аут',	//Transaction timeout	Произошёл тайм-аут
		systemError: 'Системная ошибка',	//System error	Системная ошибка
		invalidTerminalIdentifier: 'Неправильный идентификатор терминала',	//Invalid terminal identifier	Неправильный идентификатор терминала
		downloadReceived_0: 'Был послан последний пакет - прогрузка успешно завершена',	//Download has been received in its entirety	Был послан последний пакет - прогрузка успешно завершена
		downloadReceived_1: 'Предыдущий этап прогрузки был успешно выполнен - имеются ещё данные для прогрузки.',	//Download received successfully and there is more data for this download	Предыдущий этап прогрузки был успешно выполнен - имеются ещё данные для прогрузки.
		downloadAborted: '	Прогрузка терминала остановлена. Необходимо позвонить в процессинговый центр',	//Download aborted (call for service)	Прогрузка терминала остановлена. Необходимо позвонить в процессинговый центр
		invalidCryptogram: 'Получена неверная криптограмма в транзакции с использованием шифрования трафика',	//Invalid cryptogram	Получена неверная криптограмма в транзакции с использованием шифрования трафика
		invalidMAC: 'Получен неверный MAC',	//Invalid MAC	Получен неверный MAC
		sequenceError: 'Ошибка рассинхронизации',	//Sequence error - resync	Произошла рассинхронизация. Возникает когда Sequence Number предыдущей транзакции + 1 не равен Sequence Number следующей транзакции. Для реверса возникает когда Transmission Number реверса не равен Transmission Number предыдущей транзакции.
		pinTriesLimitExceeded: 'Превышено число попыток ввода PIN.',	//Pin Tries Limit Exceeded	Превышено число попыток ввода PIN. Требуется захват (изъятие) карты
		expiredCard_1: 'Карта просрочена',	//Expired Card	Карта просрочена требуется захват (изъятие) карты.
		externalDecline: 'Требуется изъятие карты',	//External Decline Special Condition	Требуется захват (изъятие) карты.
		administrativeTrasaction: 'Административная транзакция не поддерживается',	//Administrative transaction not supported	Административная транзакция не поддерживается
	}
}
