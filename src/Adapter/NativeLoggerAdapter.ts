import { EitherAsync } from "purify-ts"
import { NativeLogger } from "../NativeModules/Android/Logger/NativeLogger"

export class NativeLoggerAdapter {

  public readonly writeLog = async (level: number, msg: string) => {
    return (await EitherAsync(() => NativeLogger.writeLog(level, msg)))
  }
}
