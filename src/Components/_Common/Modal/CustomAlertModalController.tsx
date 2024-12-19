import { AlertData } from "../../../Infrastructure/Exceptions/Errors";
import { MutableRefObject } from "react"

export type CustomModalRef = {
    show: (alertData: AlertData) => void
    hide: () => void
}

export default class ModalController {
    static modalRef: MutableRefObject<CustomModalRef>;
    static setModalRef = (ref: any) => {
        this.modalRef = ref
    }

    static showModal = (alertData: AlertData) => {
        try {
            this.modalRef?.current?.show(alertData)
        }catch (e) {
            console.log('Error with modalRef show::', this.modalRef?.current)
        }
    }

    static hideModal = () => {
        try {
            this.modalRef?.current?.hide()
        }catch (e) {
            console.log('Error with modalRef hide::', this.modalRef?.current)
        }
    }
}
