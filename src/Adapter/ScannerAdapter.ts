import { EitherAsync } from 'purify-ts/esm'
import { Scanner } from '../NativeModules/Android/Scanner/Scanner'

export class ScannerAdapter {

  constructor() {}

  public readonly getScannerStatus = async () => {
    return (await EitherAsync(() => Scanner.getScannerStatus())) 
  }

}
