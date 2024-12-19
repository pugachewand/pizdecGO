
export const terminalError = () => {
  return{
    "request" : null,
    "response" : null,
    "createdDate": new Date(),
    "errorCode": "SEND_REQUEST_ERROR",
    "errorMessage": "Device not valid",
    "requestDate": setTimeout(()=> {new Date}, 1000),
    "responseDate": null,
    "succeeded" : false
  }
}

export const terminalOnClickCancel = () => {
  return {
    "request" : {
      "amount" : 1.5,
      "currencyIso" : "RUB",
      "operation" : "MAKE_PAYMENT",
      "operationId" : 1,
      "rawData" : "SAF_TRX_AMOUNT(0): '150'\nSAF_TRX_CURRENCY_CODE(4): '643'\nSAF_OPER_ID(25): 1\nSAF_TERMINAL_ID(27): '00344224'\nSAF_MODELNO(89): 'iziGo'\n",
      "terminalId" : "00344224"
    },
    "response" : {
      "additionalResponseData" : "ОПЕРАЦИЯ ПРЕРВАНА^TERMINATED.JPG~",
      "amount" : 1.5,
      "authorizeCode" : null,
      "cardNumber" : null,
      "currencyIso" : "RUB",
      "dateTimeOfHostOperation" : "20231130112446",
      "hostResponseCode" : "ER3",
      "linkNumberRrn" : null,
      "merchantId" : "0",
      "operation" : "MAKE_PAYMENT",
      "operationId" : 1,
      "originalDateTimeOfTerminalOperation" : "20231130112446",
      "paymentStatus" : "ERROR",
      "posTerminalOperationStatus" : "OPERATION_ABORTED",
      "rawData" : "SAF_TRX_AMOUNT(0): '150'\nSAF_TRX_CURRENCY_CODE(4): '643'\nSAF_TRX_DATE_TIME_HOST(6): '20231130112446'\nSAF_RESPONSE_CODE(15): 'ER3'\nSAF_ADD_RESPONSE_DATA(19): 'ОПЕРАЦИЯ ПРЕРВАНА^TERMINATED.JPG~'\nSAF_TRX_ORG_DATE_TIME(21): '20231130112446'\nSAF_TRX_ID(23): 0\nSAF_OPER_ID(25): 1\nSAF_STAN(26): 0\nSAF_TERMINAL_ID(27): '00344224'\nSAF_MERCHANT_ID(28): '0'\nSAF_TRX_STATUS(39): 53\n",
      "receiptData" : null,
      "terminalId" : "00344224",
      "transactionIdInCommutationServer" : 0,
      "transactionIdInExternalDevice" : 0
    },
    "createdDate" : new Date(),
    "errorCode" : null,
    "errorMessage" : null,
    "requestDate" : "2023-11-30T08:24:40.516Z",
    "responseDate" : "2023-11-30T08:24:43.305Z",
    "succeeded" : true
  }
}


export const terminalInsufficientFunds = async () => {
  
return {
  "request" : {
    "amount" : 1.5,
    "currencyIso" : "RUB",
    "operation" : "MAKE_PAYMENT",
    "operationId" : 1,
    "rawData" : "SAF_TRX_AMOUNT(0): '1050'\nSAF_TRX_CURRENCY_CODE(4): '643'\nSAF_OPER_ID(25): 1\nSAF_TERMINAL_ID(27): '00344224'\nSAF_MODELNO(89): 'iziGo'\n",
    "terminalId" : "00344224"
  },
  "response" : {
    "additionalResponseData" : "ОТКЛОНЕНО",
    "amount" : 1.5,
    "authorizeCode" : null,
    "cardNumber" : "***************5677",
    "currencyIso" : "RUB",
    "dateTimeOfHostOperation" : "20231130112609",
    "hostResponseCode" : "076",
    "linkNumberRrn" : "333408530397",
    "merchantId" : "11111111",
    "operation" : "MAKE_PAYMENT",
    "operationId" : 1,
    "originalDateTimeOfTerminalOperation" : "20231130112609",
    "paymentStatus" : "ERROR",
    "posTerminalOperationStatus" : "DENIED",
    "rawData" : "SAF_TRX_AMOUNT(0): '1050'\nSAF_TRX_CURRENCY_CODE(4): '643'\nSAF_TRX_DATE_TIME_HOST(6): '20231130112609'\nSAF_PAN(10): '***************5677'\nSAF_EXP_DATE(11): '2811'\nSAF_RRN(14): '333408530397'\nSAF_RESPONSE_CODE(15): '076'\nSAF_ADD_RESPONSE_DATA(19): 'ОТКЛОНЕНО'\nSAF_TRX_ORG_DATE_TIME(21): '20231130112609'\nSAF_TRX_ID(23): 0\nSAF_OPER_ID(25): 1\nSAF_STAN(26): 0\nSAF_TERMINAL_ID(27): '00344224'\nSAF_MERCHANT_ID(28): '11111111'\nSAF_TRX_STATUS(39): 16\nSAF_RECEIPT_DATA(90): '0xDF^^\r\n         ООО «ЭР Софт»\r\n     117218, г. Москва, ул.     \r\nКедрова,,дом 14, корпус 2, этаж \r\n       5 пом. I,ком. 1-12       \r\n         VTID: 92000909         \r\nТЕРМИНАЛ №:             00344224\r\nДАТА 30/11/23     ВРЕМЯ 11:26:09\r\nОПЛАТА ПОКУПКИ\r\nMir1010       НАЗНАЧЕНИЕ ПЛАТЕЖА\r\n**** **** **** 5677\r\nПАКЕТ:0000            ЧЕК:0034\r\nПЛАТЕЖНАЯ СИСТЕМА        Mir1010\r\nТИП КАРТЫ (APP)              MIR\r\n             БЕСКОНТАКТНАЯ КАРТА\r\nAID: A0000006581010        \r\nИТОГО                  10.50 RUB\r\nKVR:                     0080\r\nКОД ОТВЕТА                   076\r\n           ОТКЛОНЕНО            \r\n ПРОВЕРЕНО НА УСТРОЙСТВЕ КЛИЕНТА\r\n-------------------------------\r\n\n\n\r\n~'\n",
    "receiptData" : "0xDF^^\r\n         ООО «ЭР Софт»\r\n     117218, г. Москва, ул.     \r\nКедрова,,дом 14, корпус 2, этаж \r\n       5 пом. I,ком. 1-12       \r\n         VTID: 92000909         \r\nТЕРМИНАЛ №:             00344224\r\nДАТА 30/11/23     ВРЕМЯ 11:26:09\r\nОПЛАТА ПОКУПКИ\r\nMir1010       НАЗНАЧЕНИЕ ПЛАТЕЖА\r\n**** **** **** 5677\r\nПАКЕТ:0000            ЧЕК:0034\r\nПЛАТЕЖНАЯ СИСТЕМА        Mir1010\r\nТИП КАРТЫ (APP)              MIR\r\n             БЕСКОНТАКТНАЯ КАРТА\r\nAID: A0000006581010        \r\nИТОГО                  10.50 RUB\r\nKVR:                     0080\r\nКОД ОТВЕТА                   076\r\n           ОТКЛОНЕНО            \r\n ПРОВЕРЕНО НА УСТРОЙСТВЕ КЛИЕНТА\r\n-------------------------------\r\n\n\n\r\n~",
    "terminalId" : "00344224",
    "transactionIdInCommutationServer" : 0,
    "transactionIdInExternalDevice" : 0
  },
  "createdDate" : new Date(),
  "errorCode" : null,
  "errorMessage" : null,
  "requestDate" : "2023-11-30T08:25:53.810Z",
  "responseDate" : "2023-11-30T08:26:09.907Z",
  "succeeded" : true
}
}

export const terminalSuccess = async () => {
  
  return {
        "createdDate": new Date(), 
        "errorCode": null, 
        "errorMessage": null, 
        "request": {
          "amount": 1.5, 
          "currencyIso": "RUB", 
          "operation": "MAKE_PAYMENT", 
          "operationId": 1, "rawData": "SAF_TRX_AMOUNT(0): '150' SAF_TRX_CURRENCY_CODE(4): '643' SAF_OPER_ID(25): 1 SAF_TERMINAL_ID(27): '00344224' SAF_MODELNO(89): 'iziGo'",
        "terminalId": "00344224"}, 
        "requestDate": "2023-11-27T09:40:14.395Z", 
        "response": {
          "additionalResponseData": "ОДОБРЕНО", 
          "amount": 1.5, "authorizeCode": "454583", 
          "cardNumber": "***************5677", 
          "currencyIso": "RUB", 
          "dateTimeOfHostOperation": "20231127124015", 
          "hostResponseCode": "001", 
          "linkNumberRrn": "333109189729", 
          "merchantId": "11111111", 
          "operation": "MAKE_PAYMENT", 
          "operationId": 1, 
          "originalDateTimeOfTerminalOperation": "20231127124015", 
          "paymentStatus": "PAID", 
          "posTerminalOperationStatus": "APPROVED", 
          "rawData": "SAF_TRX_AMOUNT(0): '150' SAF_TRX_CURRENCY_CODE(4): '643' SAF_TRX_DATE_TIME_HOST(6): '20231127124015' SAF_PAN(10): '***************5677' SAF_EXP_DATE(11): '2811' SAF_AUTH_CODE(13): '454583' SAF_RRN(14): '333109189729' SAF_RESPONSE_CODE(15): '001' SAF_ADD_RESPONSE_DATA(19): 'ОДОБРЕНО' SAF_TRX_ORG_DATE_TIME(21): '20231127124015' SAF_TRX_ID(23): 0 SAF_OPER_ID(25): 1 SAF_STAN(26): 0 SAF_TERMINAL_ID(27): '00344224' SAF_MERCHANT_ID(28): '11111111' SAF_TRX_STATUS(39): 1 SAF_RECEIPT_DATA(90): '0xDF^^", 
      "receiptData": "0xDF^^~", 
      "terminalId": "00344224", 
      "transactionIdInCommutationServer": 0, 
      "transactionIdInExternalDevice": 0}, 
      "responseDate": setTimeout(()=> {new Date}, 1000), 
      "succeeded": true
    }
  }


export const terminalAborted = () => {
    return {
      "request" : {
        "amount" : 1.5,
        "currencyIso" : "RUB",
        "operation" : "MAKE_PAYMENT",
        "operationId" : 1,
        "rawData" : "SAF_TRX_AMOUNT(0): '150'\nSAF_TRX_CURRENCY_CODE(4): '643'\nSAF_OPER_ID(25): 1\nSAF_TERMINAL_ID(27): '00344224'\nSAF_MODELNO(89): 'iziGo'\n",
        "terminalId" : "00344224"
      },
      "response" : {
        "additionalResponseData" : "ОПЕРАЦИЯ ПРЕРВАНА^TERMINATED.JPG~",
        "amount" : 1.5,
        "authorizeCode" : null,
        "cardNumber" : null,
        "currencyIso" : "RUB",
        "dateTimeOfHostOperation" : "20231127123622",
        "hostResponseCode" : "ER3",
        "linkNumberRrn" : null,
        "merchantId" : "0",
        "operation" : "MAKE_PAYMENT",
        "operationId" : 1,
        "originalDateTimeOfTerminalOperation" : "20231127123622",
        "paymentStatus" : "ERROR",
        "posTerminalOperationStatus" : "OPERATION_ABORTED",
        "rawData" : "SAF_TRX_AMOUNT(0): '150'\nSAF_TRX_CURRENCY_CODE(4): '643'\nSAF_TRX_DATE_TIME_HOST(6): '20231127123622'\nSAF_RESPONSE_CODE(15): 'ER3'\nSAF_ADD_RESPONSE_DATA(19): 'ОПЕРАЦИЯ ПРЕРВАНА^TERMINATED.JPG~'\nSAF_TRX_ORG_DATE_TIME(21): '20231127123622'\nSAF_TRX_ID(23): 0\nSAF_OPER_ID(25): 1\nSAF_STAN(26): 0\nSAF_TERMINAL_ID(27): '00344224'\nSAF_MERCHANT_ID(28): '0'\nSAF_TRX_STATUS(39): 53\n",
        "receiptData" : null,
        "terminalId" : "00344224",
        "transactionIdInCommutationServer" : 0,
        "transactionIdInExternalDevice" : 0
      },
      "createdDate" : new Date(),
      "errorCode" : null,
      "errorMessage" : null,
      "requestDate" : "2023-11-27T09:36:08.198Z",
      "responseDate" : "2023-11-27T09:36:25.349Z",
      "succeeded" : true
    }
}