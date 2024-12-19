/* eslint-disable no-restricted-syntax, no-shadow */
export enum HeaderModeEnum {
	Module = 'Модальное окно',
	ModeSelection = 'Выбор режима МП',
	ClickOnSecretMode = 'Нажатие секретной кнопки с настройками',
	ModeChangeClick = 'Нажатие на режим МП',
	CancelClick = 'Нажатие отмена',
	StartReconcilateOfTotals = 'Начать сверку итогов'
}


export enum InputName {
	CustomBackendAddress = 'CustomBackendAddress',
	PaymentReconciliationDate = 'PaymentReconciliationDate',
	PaymentReconciliationFrequency = 'PaymentReconciliationFrequency',
	TerminalID = 'TerminalID',
	PosToken = 'PosToken'
}
