export interface IBatteryHealthProvider {
    batteryLevel: number;
    isBatteryCharging: boolean;

    updateBatteryInfo(): void;
}
