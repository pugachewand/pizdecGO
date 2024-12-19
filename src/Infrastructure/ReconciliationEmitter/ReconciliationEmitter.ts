import { EmitterSubscription, NativeEventEmitter } from "react-native";

import { PaymentServiceAdapter } from '../../Adapter/SmartSaleTerminalAdapter';

export interface IReconciliation {
    subscribe: void;
    unsubscribe: void;
}

export class ReconciliationEmitter {
    eventEmitter = new NativeEventEmitter();
    private eventListener!: EmitterSubscription;
    async sendStatus(isReady: boolean) {
        const paymentService = new PaymentServiceAdapter()
        console.log('sendStatus:::', isReady)
        await paymentService.beginReconciliateOfTotals(isReady)
    } 
    subscribe(isReady: boolean) {
        // При переходе с одного экрана на другой, unsubscribe предыдущего компонента выполняется позже,
        // чем инициализируется subscribe нового комопнента и unsubscribe удаляет лисенер из предыдущего компонента и из текущего, поэтому тут нужен setTimeout
        setTimeout(() => {
            this.eventListener = this.eventEmitter.addListener('ROTOnBegin', event => {
                this.sendStatus(isReady)
            });
            console.log('subscribe in class')
        }, 200)
    }
    unsubscribe() {
        // this.eventEmitter.listenerCount('ROTOnBegin')
        if (this.eventListener) {
            this.eventListener.remove()
        }
        console.log('unsubscribe:::', this.eventEmitter.listenerCount('ROTOnBegin'))
        // this.eventEmitter.removeAllListeners('ROTOnBegin')
    }  
}
