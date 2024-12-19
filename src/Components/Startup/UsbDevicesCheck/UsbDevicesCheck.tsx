import { ActivityIndicator, View } from 'react-native';
import { AppError, HttpError } from '../../../Infrastructure/Exceptions/Errors';
import { PaymentServiceErrorCode, SmartSaleTerminalGetConnectionStatusCommand } from '../../../NativeModules/Android/SmartSaleTerminal/SmartSaleTerminal';
import React, { useCallback, useContext } from 'react';
import AppFlowEvents from '../../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../../Machines/AppFlow/AppFlowMachine';
import { CustomText } from '../../_Common/CustomText/CustomText';
import { DotLoaders } from '../../_Common/Loaders/DotLoaders';
import { GetConnectionStatusErrorEnum } from '../LaunchScreen/LaunchScreenEnum';
import { MainNavigatorRoutes } from '../../../EntryPoint/MainNavigator';
import { PaymentServiceAdapter } from '../../../Adapter/SmartSaleTerminalAdapter';
import { PosTerminalOperationStatusEnum } from '../../../Tabs/Payment/PaymentEnum';
import { ScannerAdapter } from '../../../Adapter/ScannerAdapter';
import { StackScreenProps } from "@react-navigation/stack"
import { StatusCodes } from 'http-status-codes';
import { dateToISOLikeButLocal } from '../../../Logic/Date/DateToLocalISO';
import { getHoursMinutes } from '../../../Logic/Date/GetHoursAndMinutesFromString';
import { globalContext } from '../../../DependencyInjection/AppContext';
import { i18nContext } from '../../../EntryPoint/Context/i18nContext';
import { LaunchScreenStyles as s } from '../LaunchScreen/LaunchScreen.Styles';
import { useFocusEffect } from '@react-navigation/native';
import { ReconciliationEmitter } from '../../../Infrastructure/ReconciliationEmitter/ReconciliationEmitter';
import { useEmergencyReturn } from '../../../Infrastructure/EmergencyReturn';
import AppFlowStates from '../../../Machines/AppFlow/AppFlowStates';
import { EmergencyReturnTimerEnum } from '../../../Infrastructure/EmergencyReturn/EmergencyReturnTypes';
import { checkConnectionStatusDebug } from '../../../Core/ApplicationHealthProviderVerifier/types/checkConnectionStatusDebug';
import { FailureDebugCause, FailureSeverity } from '../../../Core/connections/MqttClient/IMqttClient';
import { AppIoCContainer } from '../../../Infrastructure/Objects/AppIoContainer';
import {
    generateFailureDebugInfo,
    generateFailureInfoParams,
    getCheckConnectedText,
    sendFailureInfoToRabbitMqAsync
} from '../../../Core/connections/MqttClient/MqttClientMessageRouting';
import dayjs from 'dayjs';
import { shouldPerformCheck } from '../../../Core/AppHealthProvider/shouldPerformCheck';
import { ApplicationHealthProviderItemName } from '../../../Infrastructure/Objects/ObjectAvailabilityVerifiers/types';

export type usbDevicesCheckProps = StackScreenProps<MainNavigatorRoutes, 'usbDevicesCheck'>

export const UsbDevicesCheck = (props: usbDevicesCheckProps) => {
    const [state, send] = useContext(AppFlowMachineContext)
    const appHealthProvider = AppIoCContainer.getAppHealthProvider()
    const paymentService = new PaymentServiceAdapter()
    const scannerService = new ScannerAdapter()
    const preferences = globalContext.preferences.value
	const context = useContext(i18nContext)
    const setCurrentFunction = useEmergencyReturn(AppFlowStates.UsbDevicesCheck,EmergencyReturnTimerEnum.USB_DEVICES_CHECK)
	const i18n = context.i18n.auth.value
    const errorViewI18n = globalContext.preferences.value.i18n.errorView.value
    const i18nChange = globalContext.preferences.value.i18n.auth.value.changePhoneNumber
    const terminalErrorTitle = errorViewI18n.notReady.terminalConnectionErrorTitle
    const scannerErrorTitle = errorViewI18n.notReady.scannerConnectionErrorTitle
    const scannerErrorMessage = errorViewI18n.notReady.scannerConnectionErrorDescription
	const reconciliationEmitter = new ReconciliationEmitter()
    const posTerminalLinkWithBankErrorProvider = AppIoCContainer.getPosTerminalLinkWithBankErrorProvider()
    const checkTerminalConnectionAsync = async () => {
        let debugInfo
        let failureInfoParams
        try {
            // TODO: Нужно ли это?
			const getConnectionStatusEither = await paymentService.getConnectionStatus() as SmartSaleTerminalGetConnectionStatusCommand;
			console.log('getConnectionStatusEither==================jjj', getConnectionStatusEither);
            debugInfo = generateFailureDebugInfo(getConnectionStatusEither.response?.operationId || 1, getConnectionStatusEither.response?.posTerminalOperationStatus || '', getConnectionStatusEither.errorCode || '')
            failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Lowest,
                FailureDebugCause.STATUS_TERMINAL_LINK_WITH_BANK
            )
            // TODO: Попробовать на тест без runInAction
            if (getConnectionStatusEither.response?.posTerminalOperationStatus === PosTerminalOperationStatusEnum.INVALID_TERMINAL_ID) {
                await globalContext.preferences.value.setTerminalId('');
                send({
                    type: AppFlowEvents.ERROR,
                    errorTitle: globalContext.preferences.value.i18n.errorView.value.notReady.errorTitle,
                    errorMessage: globalContext.preferences.value.i18n.errorView.value.notReady.errorGetPosSettingsDescription,
                    isPosTokenNotValid: true
                })
                return;
            }
            if (getConnectionStatusEither.errorCode !== null) {
                smartSaleTerminalErrorHandler(getConnectionStatusEither.errorCode);
                return;
            }
            else if (getConnectionStatusEither.response?.posTerminalOperationStatus !== PosTerminalOperationStatusEnum.APPROVED) {
                posTerminalLinkWithBankErrorProvider.incrementConnectionErrorCount()
                send({
                    type: AppFlowEvents.ERROR,
                    errorTitle: terminalErrorTitle,
                    errorMessage: `${globalContext.preferences.value.i18n.errorTerminal.value.getConnectionStatusErrors.connectionFailed} ${getConnectionStatusEither.response?.posTerminalOperationStatus}`
                });
                return;
            }
            else if (getConnectionStatusEither.response?.posTerminalOperationStatus === PosTerminalOperationStatusEnum.APPROVED) {
                posTerminalLinkWithBankErrorProvider.cleanConnectionErrorCount()
                const needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isPosTerminalLinkWithBankEstablished)
                if (needCheck) {
                    appHealthProvider.setPosTerminalLinkWithBankEstablished(true)
                }
                appHealthProvider.setLastCheckedLinkWithBankTime(dayjs().toDate())
                startROTEngineAsync()
            }
            // TODO: Оставлять else или делать условия по типу PosTerminalOperationStatusEnum.APPROVED и succeded = true
            // else {
            // }
		} catch (err) {
            send({
                type: AppFlowEvents.ERROR,
                errorTitle: terminalErrorTitle,
                errorMessage: err
            })
			console.log("getConnectionStatus error", err);
            debugInfo = generateFailureDebugInfo(1, '', 'Get connection with pos terminal :: ' + err)
            failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Normal,
                FailureDebugCause.STATUS_TERMINAL_LINK_WITH_BANK
            )
		} finally {
			// Additional cleanup or actions if needed
            failureInfoParams && sendFailureInfoToRabbitMqAsync(failureInfoParams)
		}
    }

    const smartSaleTerminalErrorHandler = (error: PaymentServiceErrorCode | AppError)  => {
		if (error instanceof HttpError && error.axiosError.response?.status === StatusCodes.BAD_REQUEST) {
            send({
                type: AppFlowEvents.ERROR,
                errorTitle: terminalErrorTitle,
                errorMessage: i18nChange.errors.verificationCodeInvalid
            })
		}
		else if(error === 'UNDEFINED' || error === 'SEND_REQUEST_ERROR' || error === 'UNEXPECTED') {
            send({
                type: AppFlowEvents.ERROR,
                errorTitle: terminalErrorTitle,
                errorMessage: mapTerminalErrors(error as GetConnectionStatusErrorEnum)
            })
		}
        // TODO: а если ошибки не UNDEFINED, SEND_REQUEST_ERROR, UNEXPECTED ?
	}
    const mapTerminalErrors = (error: GetConnectionStatusErrorEnum) => {
		const connectionStatusErrors = globalContext.preferences.value.i18n.errorTerminal.value
		switch (error) {
			case GetConnectionStatusErrorEnum.SEND_REQUEST_ERROR as GetConnectionStatusErrorEnum: return connectionStatusErrors.getConnectionStatusErrors.sendRequestError
			case GetConnectionStatusErrorEnum.UNDEFINED as GetConnectionStatusErrorEnum: return connectionStatusErrors.getConnectionStatusErrors.undefinedError
			case GetConnectionStatusErrorEnum.UNEXPECTED as GetConnectionStatusErrorEnum: return connectionStatusErrors.getConnectionStatusErrors.unexpectedError
			default: return connectionStatusErrors.getConnectionStatusErrors.unexpectedError
		}
	}
    const parseFrequency = () => {
        const intFromStorage = parseInt(preferences.paymentReconciliationFrequency || '1440')
        return Number.isNaN(intFromStorage) ? 1440 : intFromStorage
    }
    const startROTEngineAsync = async () => {
        setCurrentFunction('UsbDevicesCheck > startROTEngine()')
        const timeToReconcile = getHoursMinutes(preferences.paymentReconciliationDate || '02:00')
        const startTimeToReconcile = preferences.appStartDate ? dateToISOLikeButLocal(new Date(preferences.appStartDate)) : null
        let debugInfo
        let failureInfoParams
        try {
            await paymentService.createReconciliateOfTotals(timeToReconcile, parseFrequency(), startTimeToReconcile, 3)
            await paymentService.initializeReconciliateOfTotals()
            debugInfo = generateFailureDebugInfo(0, 'ROT Engine is initialized', '')
            failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Lowest,
                FailureDebugCause.RECONCILIATION_OF_TOTALS
            )
            send(AppFlowEvents.SUCCESS)
        } catch (err) {
            console.log('Error initialize Reconciliation :: ', err)
            debugInfo = generateFailureDebugInfo(1, '', 'Error initialize Reconciliation :: ', err)
            failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Normal,
                FailureDebugCause.RECONCILIATION_OF_TOTALS
            )
            send({
                type: AppFlowEvents.ERROR,
                // TODO: ОШИБКУ
                errorTitle: terminalErrorTitle,
                errorMessage: i18nChange.errors.verificationCodeInvalid
            })
        }finally {
            failureInfoParams && sendFailureInfoToRabbitMqAsync(failureInfoParams)
        }
    }

    const startCheckUsbDevicesAsync = async () => {
        setCurrentFunction('UsbDevicesCheck > startCheckUsbDevices()')
        let isScannerConnected = true
        let debugInfo
        let failureInfoParams
        try {
            isScannerConnected = (await scannerService.getScannerStatus()).unsafeCoerce()
            console.log('isScannerConnected:::', isScannerConnected)
            debugInfo = generateFailureDebugInfo(Number(isScannerConnected), getCheckConnectedText(isScannerConnected))
            failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Lowest,
                FailureDebugCause.STATUS_BARCODE_SCANNER
            )
            const needCheck = shouldPerformCheck(ApplicationHealthProviderItemName.isScannerAvailable)
            if (needCheck) {
                appHealthProvider.setScannerAvailability(isScannerConnected)
            }
        }catch (e) {
            console.log('Error check scanner usb:::', e)
            debugInfo = generateFailureDebugInfo(1, '', 'Error check scanner usb:::' + e)
            failureInfoParams = generateFailureInfoParams(
                debugInfo,
                FailureSeverity.Normal,
                FailureDebugCause.STATUS_BARCODE_SCANNER
            )
        } finally {
            failureInfoParams && sendFailureInfoToRabbitMqAsync(failureInfoParams)
        }


        if (isScannerConnected) {
            await checkTerminalConnectionAsync()
        }
        else {
            send({
                type: AppFlowEvents.ERROR,
                errorTitle: scannerErrorTitle,
                errorMessage: scannerErrorMessage
            })
        }
    }


    const initialCheckAsync = async () => {
        setCurrentFunction('UsbDevicesCheck > initialCheck()')
        let debugInfo
        let failureInfoParams
        try {
            const isSuccessSetTerminalIdEither = await paymentService.setTerminalId(globalContext.preferences.value.terminalId || '')
            const isSuccessSetTerminalId = isSuccessSetTerminalIdEither.unsafeCoerce()
            debugInfo = generateFailureDebugInfo(Number(isSuccessSetTerminalId), `Success: ${isSuccessSetTerminalId}`, '')
            failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, FailureDebugCause.SET_TERMINAL_ID)
        }catch (e) {
            console.log(`Error setTerminalID::: ${e}`)
            failureInfoParams = generateFailureInfoParams(`Error setTerminalID::: ${e}`, FailureSeverity.Lowest)
            debugInfo = generateFailureDebugInfo(0, 'Success: false', `Error setTerminalID::: ${e}`)
            failureInfoParams = generateFailureInfoParams(debugInfo, FailureSeverity.Lowest, FailureDebugCause.SET_TERMINAL_ID)
        }
        await sendFailureInfoToRabbitMqAsync(failureInfoParams)
        if (checkConnectionStatusDebug) {
            console.log('USB DevicesCheck is starting:::')
            await startCheckUsbDevicesAsync()
        }
        else {
            await startROTEngineAsync()
        }
    }

    useFocusEffect(
        useCallback(() => {
            setCurrentFunction('')
            reconciliationEmitter.subscribe(false)
            initialCheckAsync()
			return () => {
				reconciliationEmitter.unsubscribe()
                setCurrentFunction('')
			}
        }, [])
    )

    return (
        <View style={s.mainContainer}>
			<View style={[s.container, s.loaderContainer]}>
				<DotLoaders accentColor={true}/>
			</View>
				{
                    checkConnectionStatusDebug && (
                        <View style={[s.container, s.textContainer]}>
							<ActivityIndicator color="#EEF33D"/>
                                <CustomText style={s.text}>
                                    {
                                        i18n.registration.operations.getTerminalConnectionStatus
                                        || "Идет проверка соединения с  POS-терминалом"
                                    }
                                </CustomText>
                        </View>
					)
				}
		</View>
    )
}
