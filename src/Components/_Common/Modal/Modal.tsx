import { Image, Modal, TouchableOpacity, View } from 'react-native'
import React, { ReactElement } from 'react'
import { CustomText } from '../CustomText/CustomText'
import { Timer } from '../Timer/Timer'
import { modalStyles as s } from './Modal.Styles'
import { WhatsApp } from '../../../Tabs/Support/Icons/WhatsApp.Icon';
import { Telegram } from '../../../Tabs/Support/Icons/Telegram.Icon';
import { DotLoaders } from '../Loaders/DotLoaders';

export type ModalButtonProps = {
	name: string
	accent?: boolean
	onPress: () => void
}

type Props = {
	timerKey: number
	headerText?: string
	headerIcon?: ReactElement
	contentHeaderText?: string
	contentText?: string
	text?: string
	vertical?: boolean
	isCancelPurchaseLoading?: boolean
	isConnectionError?: boolean
	isConnectionTerminalWithBank?: boolean
	hotlineSupportDescription?: string
	buttons: ModalButtonProps[]
	closingTimer: number
	isPlaying: boolean
	onComplete: () => void
	timerSize: number
}

export const MainModal = (props: Props) => {
	return(
		<>
		{
			props.isPlaying &&
				<>
					<Modal
						animationType='fade'
						transparent={true}
						statusBarTranslucent={true}
						// visible={props.visible}
					>

						<View style={s.modalContainer}>
							<View style={s.modalView}>

								{
									props.headerText &&
										<View style={s.header}>
											<View style={s.iconWrapper}>
												{props.headerIcon}
											</View>
											<CustomText style={s.headerText}>
												{props.headerText}
											</CustomText>
										</View>
								}
								<View style={[s.main, props.isConnectionError && s.mainConnectionError]}>
									{
										props.contentHeaderText && <CustomText style={[s.contentText,props.isConnectionError && s.contentTextConnection]}>
											{props.contentHeaderText}
										</CustomText>
									}
									{
										props.contentText && <CustomText style={[s.contentText,props.isConnectionError && s.contentSubTextConnection]}>
											{props.contentText}
										</CustomText>
									}
									{!props.isConnectionError && !props.isCancelPurchaseLoading && <View style={s.timer}>
										<Timer
											size={props.timerSize}
											timerKey={props.timerKey}
											inActiveTimer={true}
											closingTimer={props.closingTimer}
											isPlaying={props.isPlaying}
											onComplete={props.onComplete}
										/>
									</View>}
									{props.isCancelPurchaseLoading && <View style={s.dotLoaderBlock}>
										<DotLoaders accentColor={true} medium={true}/>
									</View>}
									{props.isConnectionError && <CustomText style={[s.contentText, s.contentTextSupport]}>
										{props.hotlineSupportDescription}
									</CustomText>}
									{props.isConnectionError && <View style={s.messengersContainer}>
										<View style={s.messenger}>
											<View style={s.messengerDescription}>
												<WhatsApp width={37} height={37}/>
												<CustomText style={s.messengerTitle}>WhatsApp</CustomText>
											</View>
											<View style={s.messengerQrCodeBlock}>
												<Image style={s.messengerQrCode} source={require('../../../Tabs/Support/Icons/QrWhatsApp.png')}/>
											</View>
										</View>
										<View style={s.messenger}>
											<View style={s.messengerDescription}>
												<Telegram width={37} height={37}/>
												<CustomText style={s.messengerTitle}>Telegram</CustomText>
											</View>
											<View style={s.messengerQrCodeBlock}>
												<Image style={s.messengerQrCode} source={require('../../../Tabs/Support/Icons/QrTelegram.png')}/>
											</View>
										</View>
									</View>}
								</View>
								{!props.isConnectionError && <View style={[s.buttonWrap, props.buttons.length > 1 && s.spaceBetween]}>
									{props.buttons.map(button =>
											<TouchableOpacity
												key={button.name}
												style={[
													s.modalButton,
													button.accent && s.modalButtonAccent,
												]}
												onPress={button.onPress}
											>
												<CustomText style={[s.textStyle, button.accent && s.textStyleAccent]}>{button.name}</CustomText>
											</TouchableOpacity>)}
								</View>}
							</View>
						</View>
					</Modal>
				</>
			}
			</>
	)
}

