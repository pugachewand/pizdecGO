import { PaymentI18n} from './Payment.i18n'

export const PaymentENG: PaymentI18n = {
	payment: {
		header: 'Pay for your purchase',
		description: 'Follow the instructions on the terminal',
		paymentLoading: 'Payment Processing',
		paymentError: 'Payment failed',
		paymentErrorDescription: 'Sorry, your payment was not processed:',
		defaultPaymentErrorMessage: '"Could not establish a connection to the POS terminal"',
	},
	autoClose: {
		headerText: 'Do you want to continue paying?',
		contentHeaderText: 'When the timer expires, the payment process will be interrupted',
		contentText: 'Click on the button to continue payment',
	},
  paymentError: {
    success: 'The operation was successful.',
    failed: 'The operation was failed.',
    noLinkingPoint: 'The gateway for linking bank cards is not set.',
    invalidPaymentData: 'Invalid banking card or cryptogram data.',
    noPaymentService: 'The payment gateway for the brand is not specified.',
    internalError: 'Internal server error.',
    integrationError: 'An error occurred while calling the payment gateway method.',
    transportError: 'A network error occurred while calling the payment gateway method.',
    referToCardIssuer: 'The issuer\'s refusal to conduct an online transaction.',
    invalidMerchant: 'The issuer\'s refusal to conduct an online transaction.',
    pickUpCard: 'The card is lost.',
    doNotHonor: 'Refusal by the issuer without explanation.',
    error: 'Network failure to carry out the operation or incorrect CVV code.',
    invalidTransaction: 'The card is not intended for online payments.',
    amountError: 'The transaction amount is too small or too large.',
    invalidCardNumber: 'Invalid card number.',
    noSuchIssuer: 'Issuer not found.',
    transactionError: 'Refusal by the issuer without explanation.',
    formatError: 'Error on the side of the acquirer - the transaction was formed incorrectly.',
    bankNotSupportedBySwitch: 'Unknown card issuer.',
    expiredCardPickup: 'The card has expired.',
    suspectedFraud: 'The issuer\'s refusal is a suspicion of fraud.',
    restrictedCard: 'The card is not intended for payments. Payments for this card are prohibited.',
    lostCard: 'The card is lost.',
    stolenCard: 'The card has been stolen.',
    insufficientFunds: 'Insufficient funds on the card.',
    expiredCard: 'The card is expired or the expiration date is incorrect.',
    transactionNotPermitted: 'Card restriction.',
    suspectedFraudDecline: 'The transaction was rejected by the bank on suspicion of fraud.',
    securityViolation: 'The card has been blocked due to security breaches.',
    exceedWithdrawFrequency: 'The limit of transactions on the card has been exceeded.',
    incorrectCvv: 'Invalid CVV code.',
    timeout: 'The issuer is not available. Timeout exceeded.',
    cannotReachNetwork: 'The issuer is not available. The network is unavailable.',
    systemError: 'Acquiring bank or network error.',
    unableToProcess: 'The transaction cannot be processed for other reasons.',
    authenticationFailed: '3-D Secure authorization failed.',
    authenticationUnavailable: '3-D Secure authorization is not available.',
    antiFraud: 'Acquirer limits on transactions.',
    AuthenticationRequired: 'This card requires authentication.',
    CardNotSupported: 'The card does not support this type of purchase.',
    CurrencyNotSupported: 'The card does not support the specified currency.',
    DuplicateTransaction: 'Most recently a transaction was sent with the same amount and card details.',
    IncorrectPin: 'Incorrect PIN entered.',
    IncorrectPostalCode: 'Postal code is incorrect.',
    InvalidAccount: 'The card or account the card is linked to is invalid.',
    ExpirationDateInvalid: 'The card has expired.',
    MerchantBlacklist: 'The payment was declined because it matches the value on the blacklist',
    PinRequired: 'The card was declined because it requires a PIN.',
    PinTryExceeded: 'Exceeded the allowed number of PIN entry attempts.',
    TestmodeDecline: 'Stripe test card number was used.',
    //pos terminal error
    posTerminalFailed: 'Terminal error.\nRepeat payment or contact our support for help',
		emergencyCancel: 'There was an emergency terminal cancellation',
		noConnection: 'No terminal connection',
		operationAborted: 'The operation was aborted',
		denied: 'The operation was rejected',
	},
  primiKartuStatusCode: {
    //TODO: нужно перевести и заполнить поля
    approved: 'Оплата прошла успешно',
		approved_0: 'string',	//Approved balances available	Присылается в случае удачного выполнения финансовой транзакции если ответ хоста содержит баланс
		approved_1: 'string',	//Approved no balances available	Присылается в случае удачного выполнения финансовой транзакции
		approved_2: 'string',	//Approved additional identification requested	Одобрено. Требуется дополнительная идентификация личности клиента (необходимо проверить документ удостоверяющий личность - паспорт и т.п.)
		approved_3: 'string',	//Approved script processing result required	Одобрено. Требуется дополнительный запрос транзакции с результатом выполнения работы микропроцессорной карты.
		approved_4: 'string',	//Approved administrative transaction	Административная транзакция выполнена успешно
		approved_5: 'string',	//Approved for a lesser amount	Авторизация на меньшую сумму
		generalFailed: 'string',	//General	Финансовую транзакцию выполнить не удалось
		expiredCard_0: 'string',	//Expired card	Карта клиента просрочена
		numberOfPinTriesExceede: 'string',	//Number of PIN tries exceeded	Превышено число попыток ввода PIN
		noSharingAllowed: 'string',	//No sharing allowed	Не удалось маршрутизировать транзакцию
		invalidTransaction: 'string',	//Invalid transaction	Транзакция имеет некорректные атрибуты или данная операция на данном терминале не разрешена
		transactionNotSupported: 'string',	//Transaction not supported by institution	Запрашиваемая операция не поддерживается хостом
		lostOrStoleCard: 'string',	//Lost or stolen card	Карта клиента имеет статус "потеряна" или "украдена"
		invalidCardStatus: 'string', //Invalid card status	Карта клиента имеет неправильный статус
		retrictedStatus: 'string',	//Restricted status	Карта клиента имеет ограниченные возможности
		accountNotFound: 'string',	//Account not found	Не найден вендор с указанным номером счета
		wrongCustomerInformation: 'string',	//Wrong customer information for payment	Неверное количество информационных полей для заданного вендора
		customerInfFormatError: 'string',	//Customer information format error	Неверный формат информационного поля платежа.
		prepaidCodeNotFound: 'string',	//Prepaid Code not found	Не найден prepaid-код на указанную сумму
		badTrackInformation: 'string',	//Bad track information	Track2 карты клиента содержит неверную информацию
		badMessageEdit: 'string',	//Bad message edit	Неверный формат сообщения (не хватает полей транзакции или поле неправильно заполнено)
		unableToAuth: 'string',	//Unable to authorize	Невозможно авторизовать
		invalidCreditPan: 'string',	//Invalid credit PAN	Неверный PAN карты получателя перевода
		insufficientFunds: 'string',	//Insufficient funds	На счете клиента не хватает средств
		dublicateTransactionReceived: 'string',	//Duplicate transaction received	Произошло дублирование транзакции. Данная ситуация может возникнуть в случае если поле заголовка транзакции "Transmission number" повторяется.
		maxNumberOfTimesUsed: 'string',	//Maximum number of times used	Превышение количества использований карты клиента за определенный промежуток времени
		balanceNotAllowed: 'string',	//Balance not allowed	Невозможно выдать баланс
		amountOverMax: 'string',	//Amount over maximum	Превышение лимита по сумме
		unableToProcess: 'string',	//Unable to process	Невозможно провести транзакцию
		unableToAuthCallToIssuer: 'string',	//Unable to authorize - call to issuer	Невозможно авторизовать - требуется телефонный запрос авторизации транзакции у эмитента (Referral service)
		cardNotSupported: 'string',	//Card not supported	Данный тип карт не поддерживается
		transactionDublicated: 'string',	//Transaction dublicated	Транзакция уже существует
		cardNotFound: 'string',	//Card not found	Карта не найдена
		UIDNotFound: 'string',	//UID not found	Внешний идентификатор карты не найден
		invalidAccount: 'string',	//Invalid account	Неправильный счет клиента
		inCorretPin: 'string',	//Incorrect PIN	Неправильный PIN
		invalidAdvanceAmount: 'string',	//Invalid advance amount	Некорректная сумма
		invalidTransactionCode: 'string',	//Invalid transaction code	Неверный код транзакции
		badCAVV: 'string',	//Bad CAVV	Неверное значение CAVV
		badCAVV2: 'string',	//Bad CVV2	Неверное значение CVV2
		notFoundOriginalTransactionSlip: 'string',	//Original transaction not found for slip	Не найдена оригинальная транзакция для слипа
		slipAlreadyReceived: 'string',	//Slip already received	Слип принимается повторно
		weakPin: 'string',	//Weak PIN	Новый PIN является "слабым" (т.е. легкоугадываемым)
		//600	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
		//699	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
		formatError: 'string',	//Format error	Ошибка формата
		notFoundOriginalTransactionReverse: 'string',	//Original transaction not found for reverse	Не найдена оригинальная транзакция для реверса
		invalidCloseTransaction: 'string',	//Invalid close transaction	Неверная операция закрытия периода (пакета смены дня)
		transactionTimeout: 'string',	//Transaction timeout	Произошёл тайм-аут
		systemError: 'string',	//System error	Системная ошибка
		invalidTerminalIdentifier: 'string',	//Invalid terminal identifier	Неправильный идентификатор терминала
		downloadReceived_0: 'string',	//Download has been received in its entirety	Был послан последний пакет - прогрузка успешно завершена
		downloadReceived_1: 'string',	//Download received successfully and there is more data for this download	Предыдущий этап прогрузки был успешно выполнен - имеются ещё данные для прогрузки.
		downloadAborted: 'string',	//Download aborted (call for service)	Прогрузка терминала остановлена. Необходимо позвонить в процессинговый центр
		invalidCryptogram: 'string',	//Invalid cryptogram	Получена неверная криптограмма в транзакции с использованием шифрования трафика
		invalidMAC: 'string',	//Invalid MAC	Получен неверный MAC
		sequenceError: 'string',	//Sequence error - resync	Произошла рассинхронизация. Возникает когда Sequence Number предыдущей транзакции + 1 не равен Sequence Number следующей транзакции. Для реверса возникает когда Transmission Number реверса не равен Transmission Number предыдущей транзакции.
		pinTriesLimitExceeded: 'string',	//Pin Tries Limit Exceeded	Превышено число попыток ввода PIN. Требуется захват (изъятие) карты
		expiredCard_1: 'string',	//Expired Card	Карта просрочена требуется захват (изъятие) карты.
		externalDecline: 'string',	//External Decline Special Condition	Требуется захват (изъятие) карты.
		administrativeTrasaction: 'string',	//Administrative transaction not supported	Административная транзакция не поддерживается
	}
}
