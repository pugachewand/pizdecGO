type AllowedResultCode = 'UNKNOWN'
    | 'DONE'
    | 'PROCESSING'
    | 'ERROR'
    | 'BT_ADAPTER_NOT_FOUND'
    | 'BT_ADAPTER_DISABLED'
    | 'BT_NOT_PAIRED_DEVICES'
    | 'BT_DEVICE_NOT_FOUND'
    | 'DEVICE_CONNECT_ERROR'
    | 'SEND_ERROR'
    | 'READ_ERROR'
    | 'NAK_ERROR'
    | 'CRC_ERROR'
    | 'PACKET_ERROR'
    | 'USB_DEVICE_NOT_FOUND'
    | 'USB_DEVICE_ERROR'

type Operation = 'GET_CONNECTION_STATUS' | 'MAKE_PAYMENT' | 'CANCEL_PAYMENT' | 'MAKE_REFUND' | 'RECONCILIATION_OF_TOTALS'

export type PaymentServiceErrorCode = 'UNDEFINED' | 'UNEXPECTED' | 'SEND_REQUEST_ERROR'



export  interface GetConnectionStatusRequest {
    operationId: number,
    operation: Operation | '',
    rawData: string,
    terminalId: string,
}

export  interface GetConnectionStatusResponse {
    operationId: number,
    operation: Operation | '',
    terminalId: string,
    rawData: string,
    posTerminalOperationStatus: string,
    additionalResponseData: string,
}



export interface MakePaymentRequest {
    operationId: number,
    operation: Operation | '',
    rawData: string,
    terminalId: string,
    amount: number,
    currencyIso: string,
}
export interface MakePaymentResponse {
    operationId: number,
    rawData: string,
    operation: Operation | '',
    terminalId: string,
    additionalResponseData: string,
    posTerminalOperationStatus: string,
    amount: number,
    currencyIso: string,
    paymentStatus: string,
    hostResponseCode: string,
    dateTimeOfHostOperation: string,
    originalDateTimeOfTerminalOperation: string,
    transactionIdInCommutationServer: number,
    transactionIdInExternalDevice: number,
    merchantId: string,
    cardNumber: string,
    authorizeCode: string,
    linkNumberRrn: string,
    receiptData: string
}

export interface CancelPaymentRequest {
    operationId: number,
    operation: Operation | '',
    terminalId: string,
    rawData: string,
    amount: number,
    currencyIso: string,
    authorizeCode: string,
    linkNumberRrn: string,
}
export interface CancelPaymentResponse {
    operationId: number,
    operation: Operation | '',
    terminalId: string,
    rawData: string,
    amount: string,
    currencyIso: string,
    posTerminalOperationStatus: string,
    paymentStatus: string,
    dateTimeOfHostOperation: string,
    hostResponseCode: string,
    originalDateTimeOfTerminalOperation: string,
    transactionIdInCommutationServer: number,
    transactionIdInExternalDevice: number,
    merchantId: string,
    cardNumber: string,
    authorizeCode: string,
    linkNumberRrn: string,
    additionalResponseData: string,
    receiptData: string
}


export interface MakeRefundPaymentRequest {
    operationId: number,
    operation: Operation | '',
    terminalId: string,
    rawData: string,
    amount: number,
    currencyIso: string,
    authorizeCode: string,
    linkNumberRrn: string,
}
export interface MakeRefundPaymentResponse {
    operationId: number,
    operation: Operation | '',
    terminalId: string,
    rawData: string,
    amount: string,
    currencyIso: string,
    posTerminalOperationStatus: string,
    paymentStatus: string,
    hostResponseCode: string,
    dateTimeOfHostOperation: string,
    originalDateTimeOfTerminalOperation: string,
    transactionIdInCommutationServer: number,
    transactionIdInExternalDevice: number,
    merchantId: string,
    cardNumber: string,
    authorizeCode: string,
    linkNumberRrn: string,
    additionalResponseData: string,
    receiptData: string
}



export interface ReconciliationOfTotalsRequest {
    operationId: number,
    operation: Operation | '',
    terminalId: string,
    rawData: string,
}
export interface ReconciliationOfTotalsResponse {
    operationId: number,
    operation: Operation | '',
    terminalId: string,
    rawData: string,
    posTerminalOperationStatus: string,
    transactionIdInExternalDevice: number,
    additionalResponseData: string,
}


export interface SmartSaleTerminalGetConnectionStatusCommand {
    request: GetConnectionStatusRequest | null,
    response: GetConnectionStatusResponse | null,
    createdDate: string;
    errorCode: PaymentServiceErrorCode | null,
    errorMessage: string | null,
    requestDate: string,
    responseDate: string | null,
    succeeded: boolean
}

export interface SmartSaleTerminalMakePaymentCommand {
    request: MakePaymentRequest | null,
    response: MakePaymentResponse | null,
    createdDate: string;
    errorCode: PaymentServiceErrorCode | null,
    errorMessage: string | null,
    requestDate: string,
    responseDate: string | null,
    succeeded: boolean
}

export interface SmartSaleTerminalMakeRefundPaymentCommand {
    request: MakeRefundPaymentRequest | null,
    response: MakeRefundPaymentResponse | null,
    createdDate: string;
    errorCode: PaymentServiceErrorCode | null,
    errorMessage: string | null,
    requestDate: string,
    responseDate: string | null,
    succeeded: boolean
}

export interface SmartSaleTerminalCancelPaymentCommand {
    request: CancelPaymentRequest | null,
    response: CancelPaymentResponse | null,
    createdDate: string;
    errorCode: PaymentServiceErrorCode | null,
    errorMessage: string | null,
    requestDate: string,
    responseDate: string | null,
    succeeded: boolean
}

export interface SmartSaleTerminalReconciliationOfTotalsPaymentCommand {
    request: ReconciliationOfTotalsRequest | null,
    response: ReconciliationOfTotalsResponse | null,
    createdDate: string;
    errorCode: PaymentServiceErrorCode | null,
    errorMessage: string | null,
    requestDate: string,
    responseDate: string | null,
    succeeded: boolean
}



export interface RequestMakePayment {
    amount: string
    currencyCode: string
}


export interface RequestMakeRefundAndCancelPayment {
    amount: string
    currencyCode: string
    authorizeCode: string
    linkNumberRrn: string
}

export interface RequestCreateReconciliateOfTotals {
    timeOfStart: string,
    periodInMinutes: number,
    lastTimeOfRun: string | null,
    repeatOnErrorCount: number
}


declare class SmartSaleTerminal {
    static getConnectionStatus: () => Promise<SmartSaleTerminalGetConnectionStatusCommand>
    static makePayment: (requestData: RequestMakePayment) => Promise<SmartSaleTerminalMakePaymentCommand>
    static reconciliateOfTotals: () => Promise<SmartSaleTerminalReconciliationOfTotalsPaymentCommand>
    static createReconciliateOfTotals: (requestData: RequestCreateReconciliateOfTotals) => Promise<any>
    static initializeReconciliateOfTotals: () => Promise<any>
    static beginReconciliateOfTotals: ({ isReady: boolean }) => Promise<any>
    static makeRefund: (requestData: RequestMakeRefundAndCancelPayment) => Promise<SmartSaleTerminalMakeRefundPaymentCommand>
    static cancelPayment: (requestData: RequestMakeRefundAndCancelPayment) => Promise<SmartSaleTerminalCancelPaymentCommand>
    static setTerminalId: (terminalId: string) => Promise<Boolean>
    static getTerminalStatus: () => Promise<boolean>
    static restartDevice: () => Promise<any>
}


export {SmartSaleTerminal}
