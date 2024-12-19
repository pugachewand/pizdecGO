export enum PaymentOperationStatusCode { // Backend Payment Status Code
  Undefined = 0,
  Success = 1,
  Failed = 2,
	// Backend errors
	NoLinkingPoint = 100,
	InvalidPaymentData = 101,
	NoPaymentService = 102,
	InternalError = 199,
	// API errors
	IntegrationError = 400,
	// Transport layer errors
	TransportError = 500,

	// Pos Terminal Payment Failed
	POSTERMINAL_FAILED = 1000,
	EMERGENCY_CANCEL = 1001,
	NO_CONNECTION = 1002,
	OPERATION_ABORTED = 1003,
	DENIED = 1004,
	OPERATION_FAILED = 1005,


	// Payment operation errors(детализация ошибки от API, за базу взят набор ошибок от CloudPayments)
	ReferToCardIssuer = 15001,
	InvalidMerchant = 15003,
	PickUpCard = 15004,
	DoNotHonor = 15005,
	Error = 15006,
	InvalidTransaction = 15012,
	AmountError = 15013,
	InvalidCardNumber = 15014,
	NoSuchIssuer = 15015,
	TransactionError = 15019,
	FormatError = 15030,
	BankNotSupportedBySwitch = 15031,
	ExpiredCardPickup = 15033,
	SuspectedFraud = 15034,
	RestrictedCard = 15036,
	LostCard = 15041,
	StolenCard = 15043,
	InsufficientFunds = 15051,
	ExpiredCard = 15054,
	TransactionNotPermitted = 15057,
	SuspectedFraudDecline = 15059,
	SecurityViolation = 15063,
	ExceedWithdrawFrequency = 15065,
	IncorrectCvv = 15082,
	Timeout = 15091,
	CannotReachNetwork = 15092,
	SystemError = 15096,
	UnableToProcess = 15204,
	AuthenticationFailed = 15206,
	AuthenticationUnavailable = 15207,
	AntiFraud = 15300,
	// Stripe errors
	AuthenticationRequired = 16001, // Эта карта требует аутентификации.
	CardNotSupported = 16002, // Карта не поддерживает этот тип покупки.
	CurrencyNotSupported = 16003, // Карта не поддерживает указанную валюту.
	DuplicateTransaction = 16004, // Совсем недавно была отправлена транзакция с идентичной суммой и данными карты.
	IncorrectPin = 16005, // Введен неверный PIN-код. Этот код отклонения применяется только к платежам, совершенным с помощью устройства для чтения карт.
	IncorrectPostalCode = 16006, // Почтовый индекс указан неверно.
	InvalidAccount = 16007, // Карта или счет, к которому привязана карта, недействительны.
	ExpirationDateInvalid = 16008, // Срок действия карты недействителен.
	MerchantBlacklist = 16009, // Платеж был отклонен, поскольку он соответствует значению в черном списке пользователя Stripe.
	PinRequired = 16010, // Карта была отклонена, так как для нее требуется PIN-код.
	PinTryExceeded = 16011, // Превышено допустимое количество попыток ввода PIN-кода.
	TestmodeDecline = 16012, // Был использован номер тестовой карты Stripe.
}

export enum PaymentStatusEnum {
  UNDEFINED = 'UNDEFINED',
  SUCCESS = 'SUCCESS',  // MakeRefundPayment, MakeCancelPayment 
  PAID = 'PAID',
  ERROR = 'ERROR',
}

export enum PosTerminalOperationStatusEnum {
  UNDEFINED = 'UNDEFINED',
  UNEXPECTED = 'UNEXPECTED',
  SEND_REQUEST_ERROR = 'SEND_REQUEST_ERROR',
  UNKNOWN = 'UNKNOWN',
  APPROVED = 'APPROVED',
  EMERGENCY_CANCEL = 'EMERGENCY_CANCEL',
  DENIED = 'DENIED',
  APPROVED_OFFLINE = 'APPROVED_OFFLINE',
  NO_CONNECTION = 'NO_CONNECTION',
  OPERATION_ABORTED = 'OPERATION_ABORTED',
  INVALID_TERMINAL_ID = 'INVALID_TERMINAL_ID',
}
export enum PrimiKartuStatusCode {
	approved_0 = 0,	//Approved, balances available	Присылается в случае удачного выполнения финансовой транзакции, если ответ хоста содержит баланс
	approved_1 = 1,	//Approved, no balances available	Присылается в случае удачного выполнения финансовой транзакции
	approved_2 = 3,	//Approved, additional identification requested	Одобрено. Требуется дополнительная идентификация личности клиента (необходимо проверить документ, удостоверяющий личность - паспорт и т.п.)
	approved_3 = 4,	//Approved, script processing result required	Одобрено. Требуется дополнительный запрос транзакции с результатом выполнения работы микропроцессорной карты.
	approved_4 = 7,	//Approved administrative transaction	Административная транзакция выполнена успешно
	approved_5 = 10,	//Approved for a lesser amount	Авторизация на меньшую сумму
	generalFailed = 50,	//General	Финансовую транзакцию выполнить не удалось
	expiredCard_0 = 51,	//Expired card	Карта клиента просрочена
 	numberOfPinTriesExceede = 52,	//Number of PIN tries exceeded	Превышено число попыток ввода PIN
	noSharingAllowed = 53,	//No sharing allowed	Не удалось маршрутизировать транзакцию
	invalidTransaction = 55,	//Invalid transaction	Транзакция имеет некорректные атрибуты или данная операция на данном терминале не разрешена
	transactionNotSupported = 56,	//Transaction not supported by institution	Запрашиваемая операция не поддерживается хостом
	lostOrStoleCard = 57,	//Lost or stolen card	Карта клиента имеет статус "потеряна" или "украдена"
	invalidCardStatus = 58, //Invalid card status	Карта клиента имеет неправильный статус
	retrictedStatus = 59,	//Restricted status	Карта клиента имеет ограниченные возможности
	accountNotFound = 60,	//Account not found	Не найден вендор с указанным номером счета
	wrongCustomerInformation = 61,	//Wrong customer information for payment	Неверное количество информационных полей для заданного вендора
	customerInfFormatError = 62,	//Customer information format error	Неверный формат информационного поля платежа.
	prepaidCodeNotFound = 63,	//Prepaid Code not found	Не найден prepaid-код на указанную сумму
	badTrackInformation = 64,	//Bad track information	Track2 карты клиента содержит неверную информацию
	badMessageEdit = 69,	//Bad message edit	Неверный формат сообщения (не хватает полей транзакции или поле неправильно заполнено)
	unableToAuth = 74,	//Unable to authorize	Невозможно авторизовать
	invalidCreditPan = 75,	//Invalid credit PAN	Неверный PAN карты получателя перевода
	insufficientFunds = 76,	//Insufficient funds	На счете клиента не хватает средств
	dublicateTransactionReceived = 78,	//Duplicate transaction received	Произошло дублирование транзакции. Данная ситуация может возникнуть в случае, если поле заголовка транзакции "Transmission number" повторяется.
	maxNumberOfTimesUsed = 82,	//Maximum number of times used	Превышение количества использований карты клиента за определенный промежуток времени
	balanceNotAllowed = 85,	//Balance not allowed	Невозможно выдать баланс
	amountOverMax = 95,	//Amount over maximum	Превышение лимита по сумме
	unableToProcess = 100,	//Unable to process	Невозможно провести транзакцию
	unableToAuthCallToIssuer = 101,	//Unable to authorize - call to issuer	Невозможно авторизовать - требуется телефонный запрос авторизации транзакции у эмитента (Referral service)
	cardNotSupported = 105,	//Card not supported	Данный тип карт не поддерживается
	transactionDublicated = 106,	//Transaction dublicated	Транзакция уже существует
	cardNotFound = 107,	//Card not found	Карта не найдена
	UIDNotFound = 108,	//UID not found	Внешний идентификатор карты не найден
	invalidAccount = 200,	//Invalid account	Неправильный счет клиента
	inCorretPin = 201,	//Incorrect PIN	Неправильный PIN
	invalidAdvanceAmount = 205,	//Invalid advance amount	Некорректная сумма
	invalidTransactionCode = 209,	//Invalid transaction code	Неверный код транзакции
	badCAVV = 210,	//Bad CAVV	Неверное значение CAVV
	badCAVV2 = 211,	//Bad CVV2	Неверное значение CVV2
	notFoundOriginalTransactionSlip = 212,	//Original transaction not found for slip	Не найдена оригинальная транзакция для слипа
	slipAlreadyReceived = 213,	//Slip already received	Слип принимается повторно
	weakPin = 215,	//Weak PIN	Новый PIN является "слабым" (т.е. легкоугадываемым)
	//600	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
	//699	С 600 до 699 пользовательский диапазон ответов	С 600 до 699 пользовательский диапазон ответов
	formatError = 800,	//Format error	Ошибка формата
	notFoundOriginalTransactionReverse = 801,	//Original transaction not found for reverse	Не найдена оригинальная транзакция для реверса
	invalidCloseTransaction = 809,	//Invalid close transaction	Неверная операция закрытия периода (пакета, смены, дня)
	transactionTimeout = 810,	//Transaction timeout	Произошёл тайм-аут
	systemError = 811,	//System error	Системная ошибка
	invalidTerminalIdentifier = 820,	//Invalid terminal identifier	Неправильный идентификатор терминала
	downloadReceived_0 = 880,	//Download has been received in its entirety	Был послан последний пакет - прогрузка успешно завершена
	downloadReceived_1 = 881,	//Download received successfully and there is more data for this download	Предыдущий этап прогрузки был успешно выполнен - имеются ещё данные для прогрузки.
	downloadAborted = 882,	//Download aborted (call for service)	Прогрузка терминала остановлена. Необходимо позвонить в процессинговый центр
	invalidCryptogram = 897,	//Invalid cryptogram	Получена неверная криптограмма в транзакции с использованием шифрования трафика
	invalidMAC = 898,	//Invalid MAC	Получен неверный MAC
	sequenceError = 899,	//Sequence error - resync	Произошла рассинхронизация. Возникает когда Sequence Number предыдущей транзакции + 1 не равен Sequence Number следующей транзакции. Для реверса возникает, когда Transmission Number реверса не равен Transmission Number предыдущей транзакции.
	pinTriesLimitExceeded = 900,	//Pin Tries Limit Exceeded	Превышено число попыток ввода PIN. Требуется захват (изъятие) карты
	expiredCard_1 = 901,	//Expired Card	Карта просрочена, требуется захват (изъятие) карты.
	externalDecline = 909,	//External Decline Special Condition	Требуется захват (изъятие) карты.
	administrativeTrasaction = 959	//Administrative transaction not supported	Административная транзакция не поддерживается
}
