import {AuthI18n, AuthScenarioI18n} from './Auth.i18n'

const RegistrationAuthScenarioRU: AuthScenarioI18n = {
  title: 'Авторизация',
  buttons: {
    login: 'Войти',
    sendSMS: 'Получить код авторизации',
    reSendCode: 'Выслать код повторно',
    restoreAccount: 'Восстановить аккаунт',
    cancel: 'Отменить',
  },
  account: {
    text: 'Аккаунт находится в процессе удаления и будет удален окончательно',
  },
  inputs: {
    codeSentToNumber: 'Проверочный код был выслан на номер',
    enterCodeFromSMS: 'Введите проверочный код ниже',
    enterPhoneNumber:
      'Для авторизации введите номер вашего мобильного телефона',
    bottomText: 'Нажимая «Получить код авторизации», Вы принимаете условия ',
    userAgreement: 'пользовательского соглашения.',
    countryPickerPlaceholder: 'Поиск',
    phoneInputPlaceholder: 'Номер телефона',
  },
  errors: {
    sendSmsError: 'Ошибка при отправке смс на номер',
    correctPhone: 'Вы ввели некорректный номер телефона',
    emptyCode: 'Введите код подтверждения',
    userAlreadyExist: 'Пользователь с таким телефоном уже есть',
    verificationCodeInvalid: 'Код подтверждения неверный',
    unexpectedAuthError: 'Ошибка аутентификации',
  },
  goBackConfirmation: {
    title: 'Вы действительно хотите остановить подтверждение номера телефона?',
    yes: 'Да',
    no: 'Нет',
  },
  captions: {
    phoneNumberIsSame: 'Введенный номер уже используется Вами',
    ableToResendSmsCodeWithin: val =>
      `Запросить код повторно можно через ${val}`,
    attention: 'Внимание!',
    banAlert:
      'Слишком много попыток!\nПожалуйста, попробуйте пройти авторизацию через 24 часа.',
    contactSupport:
      'Если вы не получили код - пожалуйста, обратитесь в службу поддержки.',
    lastAttemptToSendSMS:
      'Если вы не получили код - пожалуйста, обратитесь в службу поддержки, убедитесь, что код не попал в спам.',
    banToSendSMS:
      'Вы не можете запросить код повторно. Для авторизации обратитесь в службу поддержки.',
  },
  operations: {
    getTerminalConnectionStatus: 'Идет проверка соединения с  POS-терминалом',
  },
}

export const AuthRU: AuthI18n = {
  registration: RegistrationAuthScenarioRU,
  changePhoneNumber: {
    ...RegistrationAuthScenarioRU,
    title: 'Смена номера телефона',
    buttons: {
      ...RegistrationAuthScenarioRU.buttons,
      login: 'Сменить номер',
    },
    inputs: {
      ...RegistrationAuthScenarioRU.inputs,
      enterPhoneNumber:
        'Для смены номера введите номер вашего мобильного телефона',
      bottomText: '',
    },
  },
}
