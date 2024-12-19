import { NativeEventEmitter } from "react-native";

export interface IUsbConnector {
    subscribe: void;
    unsubscribe: void;
}

export class UsbConnector {
    eventEmitter = new NativeEventEmitter();

    subscribe(onScanResult: (value: string) => void) {
        this.eventEmitter.addListener('onScannerReadAsync', event => {
              onScanResult(event)
          });
    }
    unsubscribe() {
        this.eventEmitter.removeAllListeners('onScannerReadAsync')
    }  
}
