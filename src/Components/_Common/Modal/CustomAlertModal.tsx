import { AutoCloseTimer } from "../Timer/AutoCloseTimer";
import { DangerousIcon } from "../../../Tabs/Cart/Icons/Dangerous.Icon";
import { ModalButtonProps } from "./Modal";
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import ModalController, { CustomModalRef } from "./CustomAlertModalController";
import { AlertData } from "../../../Infrastructure/Exceptions/Errors";

const CustomAlertModal = () => {
  const [timer, setTimer] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [alertData, setAlertData] = useState<AlertData>();
  const modalRef = useRef<CustomModalRef>();

  useLayoutEffect(() => {
    ModalController.setModalRef(modalRef)
  }, [])

  useImperativeHandle(
    modalRef,
    () => ({
        show: (alertData: AlertData) => {
            setModalVisible(true);
            if(alertData) {
              setAlertData(alertData)
            }
        },
        hide: () => {
            setModalVisible(false);
            setAlertData(undefined)
        },
    }),
    []
);

  const modalAlertButton: ModalButtonProps[] = [
    {name: 'Закрыть', onPress: () => {
      ModalController.hideModal()
    }, accent: false},
  ]
  useEffect(() => {
    setTimer((prevTimer) => prevTimer + 1)
  }, [modalRef])

  return(
    <>
    {modalVisible && alertData && <AutoCloseTimer
      timerKey={timer}
      timerSize={80}
      headerIcon={<DangerousIcon/>}
      headerText={alertData.title}
      contentHeaderText={alertData.description}
      contentText={alertData.subDescription}
      modalButton={{buttons: modalAlertButton, default: false}}
      isConnectionError = {alertData.isConnectionError}
      isConnectionTerminalWithBank = {alertData.isConnectionTerminalWithBank}
      delay={0}
      isPlaying={modalVisible}
      closingTimer={5}
      onComplete={() => ModalController.hideModal()}
    />}
    </>
  )
}

export default forwardRef(CustomAlertModal)
