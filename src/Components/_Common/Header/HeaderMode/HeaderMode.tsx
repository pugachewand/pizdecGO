import { Alert, HeaderModeStore } from './HeaderMode.Store'
import { HeaderTitleProps } from '@react-navigation/elements'
import { KeyboardAvoidingView, Modal, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AppFlowEvents from '../../../../Machines/AppFlow/AppFlowEvents';
import { AppFlowMachineContext } from '../../../../Machines/AppFlow/AppFlowMachine';
import { CustomText } from '../../CustomText/CustomText';
import { InputName } from './HeaderModeEnum'
import { MaskedTextInput } from 'react-native-mask-text'
import { globalContext } from '../../../../DependencyInjection/AppContext';
import { observer } from 'mobx-react'
import { defaultHeaderModeStyles as s } from './HeaderMode.Styles'
import { useFocusEffect } from '@react-navigation/native';
import AppFlowStates from '../../../../Machines/AppFlow/AppFlowStates';
import { useI18n } from '../../../../EntryPoint/Context/i18nContext';

const store = new HeaderModeStore()
// TODO: Отображать ОЗУ, для определения утечек памяти
type AdditionalType = {
	additionalFunc: () => void
	isPosTokenNotValid?: boolean
}
export const HeaderMode = observer((props: HeaderTitleProps & AdditionalType) => {
	const [state, send] = useContext(AppFlowMachineContext)
	const i18n = useI18n().i18n.header.value
	const [isPosTokenNotValid, setPosTokenNotValid] = useState(false)
	const currentRoute = globalContext.navigatorRef.value.current?.getCurrentRoute()
	const getInputFocus = (inputName: string) => {
		switch(inputName) {
			case InputName.CustomBackendAddress: return store.customBackendAddress
			case InputName.PosToken: return store.posToken
			case InputName.PaymentReconciliationDate: return store.paymentReconciliationDate.toString()
			case InputName.PaymentReconciliationFrequency: return store.paymentReconciliationFrequency
			case InputName.TerminalID: return store.terminalId
			default: return ''
		}
	}

	const getMaxLengthOfInput = (inputName: string) => {
		switch(inputName) {
			case InputName.CustomBackendAddress: return 200
			case InputName.PosToken: return 200
			case InputName.PaymentReconciliationDate: return 5
			case InputName.PaymentReconciliationFrequency: return 4
			case InputName.TerminalID: return 20
			default: return 500
		}
	}
	const getMaskOfInput = (inputName: string) => {
		switch(inputName) {
			case InputName.PaymentReconciliationDate: return '99:99'
			case InputName.PaymentReconciliationFrequency: return '9999'
			case InputName.TerminalID: return '99999999999999999999'
			default: return '99999999999999999999999'
		}
	}

	useEffect(() => {
		if(props.isPosTokenNotValid && currentRoute?.name === 'initialPurchase') {
			setPosTokenNotValid(true)
			store.setAlertForEngMenu()
		}
	}, [props.isPosTokenNotValid, isPosTokenNotValid, state])

	    useFocusEffect(
		React.useCallback(() => {
			return () => {
				store.setAlert();
				setPosTokenNotValid(false)
			}
		}, [isPosTokenNotValid])
	    )
	const inputWithMask = [InputName.PaymentReconciliationDate, InputName.PaymentReconciliationFrequency, InputName.TerminalID]
	const showAlert = (alert: Alert) =>
		<Modal
			animationType='fade'
			transparent={true}
			visible={alert !== null}
		>
			<View style={s.centeredView}>
				<KeyboardAvoidingView
					behavior={'padding'}
				>
					<View style={s.modalView}>
						<CustomText style={s.headerTitle}>{i18n.headerMode.engineeringMenu}</CustomText>
						<View style={s.buttonsInputsContainer}>
						<View>
							{alert?.buttons.map(button =>
								<TouchableHighlight
									key={button.name}
									style={s.modalButton}
									onPress={() => {
										props.additionalFunc && props.additionalFunc()
										button.onPress()
										}
									}
								>
									<CustomText style={s.textStyle}>{button.name}</CustomText>
								</TouchableHighlight>)}
								{state.value !== AppFlowStates.EngineeringMenu &&
								<TouchableHighlight
									key={i18n.headerMode.reconciliationOfResults}
									style={s.modalButton}
									onPress={() => send({ type: AppFlowEvents.START_PAYMENT_RECONCILIATION, isManualROT: true} )}
								>
									<CustomText style={s.textStyle}>Провести сверку итогов</CustomText>
								</TouchableHighlight>
								}
						</View>
						<View>
							{alert.inputs.map(input =>
								inputWithMask.includes(input.nameInput as InputName) ?
								<MaskedTextInput
									mask={getMaskOfInput(input.nameInput)}
									maxLength={getMaxLengthOfInput(input.nameInput)}
									style={s.input}
									key={input.hint}

									placeholder={input.hint}
									placeholderTextColor={'white'}
									onChangeText={input.onChange}
									autoCapitalize={'none'}
									value={getInputFocus(input.nameInput)}
								/>
								:
								<TextInput
									maxLength={getMaxLengthOfInput(input.nameInput)}
									style={s.input}
									key={input.hint}

									placeholder={input.hint}
									placeholderTextColor={'white'}
									onChangeText={input.onChange}
									autoCapitalize={'none'}
									value={getInputFocus(input.nameInput)}
								/>
							)}

						</View>
						</View>
						<CustomText style={s.commonTextStyle}>{i18n.headerMode.lastReconciliationOfResults}{globalContext.preferences.value.appStartDate?.toString() || ''}</CustomText>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>

	return (
		<>
			<TouchableWithoutFeedback style={s.container} onPress={store.secretButtonOnPress}>
				<CustomText style={s.title}>{props.children}</CustomText>
			</TouchableWithoutFeedback>
			{store.alert && showAlert(store.alert)}
		</>
	)
})


