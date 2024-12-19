import { EitherAsync } from "purify-ts"
import { HeartBeat } from "../NativeModules/Android/HeartBeat/NativeHeartBeat"

export class HeartBeatAdapter {

  public readonly initializeHeartbeat = async (periodInSeconds: number) => {
    return (await EitherAsync(() => HeartBeat.initializeHeartbeat(periodInSeconds)))
  }
}