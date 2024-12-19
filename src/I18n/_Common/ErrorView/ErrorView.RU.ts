import {ErrorViewI18n} from './ErrorView.i18n'


export const ErrorViewRU: ErrorViewI18n = {
  message:
    'Извините, что-то пошло не так.\nМы уже отправили информацию авторам программы, а Вы попробуйте обновить страницу.',
  refresh: 'Обновить',
  noInternetConnection:
    'Похоже, пропало соединение с интернетом. Чтобы попытаться соединиться снова, нажмите кнопку "Обновить"',
  notReady: {
    errorTitle: 'Что-то пошло не так...',
    errorGetPosSettingsDescription: 'Пожалуйста, проверьте корректность настроек \nи повторите попытку',
    description: 'Мы оповестили об этом разработчиков',
    additionalDescription: 'пожалуйста, повторите попытку',
    windowClose: 'Окно закроется через',
    connectionErrorTitle: 'Упс... У нас проблема',
    connectionErrorSubtitlePartII: 'Мы уже знаем об этой ошибке. \nТехнические подробности:',
    ConnectionErrorSubtitlePart: '\nNo connection with ',
    terminalConnectionErrorTitle: 'Ошибка при проверке соединения с POS-терминалом',
    terminalConnectionErrorDescription: 'Пожалуйста, проверьте подключение к POS-терминалу и перезапустите приложение',
    scannerConnectionErrorTitle: 'Произошла ошибка при инициализации сканера',
		scannerConnectionErrorDescription: 'Пожалуйста, подключите сканер если он не подключен и перезапустите приложение',
  },
}
