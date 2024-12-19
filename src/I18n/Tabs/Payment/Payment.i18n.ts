export type PaymentI18n = {
	payment: {
		header: string,
		description: string,
		paymentLoading: string,
		paymentError: string,
		paymentErrorDescription: string,
		defaultPaymentErrorMessage: string,
	},
	autoClose: {
		headerText: string,
		contentHeaderText: string,
		contentText: string,
	}
	paymentError: {
		success: string,
		failed: string,
		noLinkingPoint: string,
		invalidPaymentData: string,
		noPaymentService: string,
		internalError: string,
		integrationError: string,
		transportError: string,
		referToCardIssuer: string,
		invalidMerchant: string,
		pickUpCard: string,
		doNotHonor: string,
		error: string,
		invalidTransaction: string,
		amountError: string,
		invalidCardNumber: string,
		noSuchIssuer: string,
		transactionError: string,
		formatError: string,
		bankNotSupportedBySwitch: string,
		expiredCardPickup: string,
		suspectedFraud: string,
		restrictedCard: string,
		lostCard: string,
		stolenCard: string,
		insufficientFunds: string,
		expiredCard: string,
		transactionNotPermitted: string,
		suspectedFraudDecline: string,
		securityViolation: string,
		exceedWithdrawFrequency: string,
		incorrectCvv: string,
		timeout: string,
		cannotReachNetwork: string,
		systemError: string,
		unableToProcess: string,
		authenticationFailed: string,
		authenticationUnavailable: string,
		antiFraud: string,
		AuthenticationRequired: string,
		CardNotSupported: string,
		CurrencyNotSupported: string,
		DuplicateTransaction: string,
		IncorrectPin: string,
		IncorrectPostalCode: string,
		InvalidAccount: string,
		ExpirationDateInvalid: string,
		MerchantBlacklist: string,
		PinRequired: string,
		PinTryExceeded: string,
		TestmodeDecline: string,
		//pos terminal error
		posTerminalFailed: string,
		emergencyCancel: string,
		noConnection: string,
		operationAborted: string,
		denied: string,
	},
	primiKartuStatusCode: {
    approved: string,
		approved_0: string,	//Approved balances available	Присылается в случае удачного выполнения финансовой транзакции если ответ хоста содержит баланс
		approved_1: string,	//Approved no balances available	Присылается в случае удачного выполнения финансовой транзакции
		approved_2: string,	//Approved additional identification requested	Одобрено. Требуется дополнительная идентификация личности клиента (необходимо проверить документ удостоверяющий личность - паспорт и т.п.)
		approved_3: string,	//Approved script processing result required	Одобрено. Требуется дополнительный запрос транзакции с результатом выполнения работы микропроцессорной карты.
		approved_4: string,	//Approved administrative transaction	Административная транзакция выполнена успешно
		approved_5: string,	//Approved for a lesser amount	Авторизация на меньшую сумму
		generalFailed: string,	//General	Финансовую транзакцию выполнить не удалось
		expiredCard_0: string,	//Expired card	Карта клиента просрочена
		numberOfPinTriesExceede: string,	//Number of PIN tries exceeded	Превышено число попыток ввода PIN
		noSharingAllowed: string,	//No sharing allowed	Не удалось маршрутизировать транзакцию
		invalidTransaction: string,	//Invalid transaction	Транзакция имеет некорректные атрибуты или данная операция на данном терминале не разрешена
		transactionNotSupported: string,	//Transaction not supported by institution	Запрашиваемая операция не поддерживается хостом
		lostOrStoleCard: string,	//Lost or stolen card	Карта клиента имеет статус "потеряна" или "украдена"
		invalidCardStatus: string, //Invalid card status	Карта клиента имеет неправильный статус
		retrictedStatus: string,	//Restricted status	Карта клиента имеет ограниченные возможности
		accountNotFound: string,	//Account not found	Не найден вендор с указанным номером счета
		wrongCustomerInformation: string,	//Wrong customer information for payment	Неверное количество информационных полей для заданного вендора
		customerInfFormatError: string,	//Customer information format error	Неверный формат информационного поля платежа.
		prepaidCodeNotFound: string,	//Prepaid Code not found	Не найден prepaid-код на указанную сумму
		badTrackInformation: string,	//Bad track information	Track2 карты клиента содержит неверную информацию
		badMessageEdit: string,	//Bad message edit	Неверный формат сообщения (не хватает полей транзакции или поле неправильно заполнено)
		unableToAuth: string,	//Unable to authorize	Невозможно авторизовать
		invalidCreditPan: string,	//Invalid credit PAN	Неверный PAN карты получателя перевода
		insufficientFunds: string,	//Insufficient funds	На счете клиента не хватает средств
		dublicateTransactionReceived: string,	//Duplicate transaction received	Произошло дублирование транзакции. Данная ситуация может возникнуть в случае если поле заголовка транзакции "Transmission number" повторяется.
		maxNumberOfTimesUsed: string,	//Maximum number of times used	Превышение количества использований карты клиента за определенный промежуток времени
		balanceNotAllowed: string,	//Balance not allowed	Невозможно выдать баланс
		amountOverMax: string,	//Amount over maximum	Превышение лимита по сумме
		unableToProcess: string,	//Unable to process	Невозможно провести транзакцию
		unableToAuthCallToIssuer: string,	//Unable to authorize - call to issuer	Невозможно авторизовать - требуется телефонный запрос авторизации транзакции у эмитента (Referral service)
		cardNotSupported: string,	//Card not supported	Данный тип карт не поддерживается
		transactionDublicated: string,	//Transaction dublicated	Транзакция уже существует
		cardNotFound: string,	//Card not found	Карта не найдена
		UIDNotFound: string,	//UID not found	Внешний идентификатор карты не найден
		invalidAccount: string,	//Invalid account	Неправильный счет клиента
		inCorretPin: string,	//Incorrect PIN	Неправильный PIN
		invalidAdvanceAmount: string,	//Invalid advance amount	Некорректная сумма
		invalidTransactionCode: string,	//Invalid transaction code	Неверный код транзакции
		badCAVV: string,	//Bad CAVV	Неверное значение CAVV
		badCAVV2: string,	//Bad CVV2	Неверное значение CVV2
		notFoundOriginalTransactionSlip: string,	//Original transaction not found for slip	Не найдена оригинальная транзакция для слипа
		slipAlreadyReceived: string,	//Slip already received	Слип принимается повторно
		weakPin: string,	//Weak PIN	Новый PIN является "слабым" (т.е. легкоугадываемым)
		//600	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
		//699	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
		formatError: string,	//Format error	Ошибка формата
		notFoundOriginalTransactionReverse: string,	//Original transaction not found for reverse	Не найдена оригинальная транзакция для реверса
		invalidCloseTransaction: string,	//Invalid close transaction	Неверная операция закрытия периода (пакета смены дня)
		transactionTimeout: string,	//Transaction timeout	Произошёл тайм-аут
		systemError: string,	//System error	Системная ошибка
		invalidTerminalIdentifier: string,	//Invalid terminal identifier	Неправильный идентификатор терминала
		downloadReceived_0: string,	//Download has been received in its entirety	Был послан последний пакет - прогрузка успешно завершена
		downloadReceived_1: string,	//Download received successfully and there is more data for this download	Предыдущий этап прогрузки был успешно выполнен - имеются ещё данные для прогрузки.
		downloadAborted: string,	//Download aborted (call for service)	Прогрузка терминала остановлена. Необходимо позвонить в процессинговый центр
		invalidCryptogram: string,	//Invalid cryptogram	Получена неверная криптограмма в транзакции с использованием шифрования трафика
		invalidMAC: string,	//Invalid MAC	Получен неверный MAC
		sequenceError: string,	//Sequence error - resync	Произошла рассинхронизация. Возникает когда Sequence Number предыдущей транзакции + 1 не равен Sequence Number следующей транзакции. Для реверса возникает когда Transmission Number реверса не равен Transmission Number предыдущей транзакции.
		pinTriesLimitExceeded: string,	//Pin Tries Limit Exceeded	Превышено число попыток ввода PIN. Требуется захват (изъятие) карты
		expiredCard_1: string,	//Expired Card	Карта просрочена требуется захват (изъятие) карты.
		externalDecline: string,	//External Decline Special Condition	Требуется захват (изъятие) карты.
		administrativeTrasaction: string,	//Administrative transaction not supported	Административная транзакция не поддерживается
	},
}
