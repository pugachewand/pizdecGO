import { IBatteryHealthProvider } from "Core/Battery/IBatteryHealthProvider";
import { ILogger } from "Core/Logger/ILogger";
import DeviceInfo from "react-native-device-info";

export class BatteryHealthProvider implements IBatteryHealthProvider {
    batteryLevel: number
    isBatteryCharging: boolean

    private readonly ModuleName = "BatteryHealthProvider"
    private readonly _logger: ILogger

    public constructor(logger: ILogger) {
        this._logger = logger
        this._logger.LogInfo(this.ModuleName, "Creating provider...")

        this.batteryLevel = 0
        this.isBatteryCharging = false;
        this._logger.LogInfo(this.ModuleName, "Created provider")
    }
    updateBatteryInfo = () => {
        this.batteryLevel = DeviceInfo.getBatteryLevelSync()
        this.isBatteryCharging = DeviceInfo.isBatteryChargingSync()
    }
}
