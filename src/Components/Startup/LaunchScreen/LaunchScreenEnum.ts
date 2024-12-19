/* eslint-disable no-restricted-syntax, no-shadow */
export enum LaunchScreenEnum {
	ModuleName = 'Запуск приложения',
	ScreenName = 'Стартовый экран',
	AuthSuccess = 'Успешная aутентификация пользователя',
	UserBlocked = 'Пользователь заблокирован при входе',
	MountScreen = 'Открытие стартового экрана',
	UserNotAuth = 'Пользователь не авторизован, перенаправление на экран регистрации',
	GetUserInfo = 'Получение данных пользователя из API',
	SelectLanguage = 'Выбор языка',
	GetUpdateConfiguration = 'Получение данных конфигурации для обновления приложения из API',
	ErrorOnUpdateApp = 'Ошибка при обновлении приложения',
	NeedUpdateApp = 'Пользователь нуждается в обновлении',
	updateFirebaseToken = 'Обновление Firebase токена',
}

export enum GetConnectionStatusErrorEnum {
	SEND_REQUEST_ERROR = 'SEND_REQUEST_ERROR',
	UNDEFINED = 'UNDEFINED',
	UNEXPECTED = 'UNEXPECTED'
}

export enum BrandUpdateSettings {
	Izipoint = 0,
	Blizko = 1
}