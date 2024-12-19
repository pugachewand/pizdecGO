/* eslint-disable no-restricted-syntax, no-shadow */
export enum AuthEnum {
	ModuleName = 'Авторизация',
	MountScreen = 'Процесс аутентификации',
	AuthScreen = 'Экран с авторизацией',
	ErrorOnOpenPrivacyPolicy = 'Не удалось открыть ссылку пользовательского соглашения',
	OpenPrivacyPolicy = 'Открыть ссылку пользовательского соглашения',
	ConfirmationMessage = 'Отправление SMS с кодом подтверждения',
	StartLoginScreen = 'Загрузка Авторизации',
	ResultOfLogin = 'Результат входа (логина)',
	ClickBackButton = 'Нажатия кнопки Назад',
	StopPhoneNumberConfirmation = 'Вы действительно хотите остановить подтверждение номера телефона?',
	CancelNumberConfirmation  = 'Отмена подтверждения номера',
	ChangePhoneNumber = 'Смена номера телефона',
	ProfileScreen = 'Профиль',
	CheckIsExistNumber = 'Проверка идентичности с текущим номером',
	FirebaseAuthError = 'Ошибка при аутентификация Firebase'
}
