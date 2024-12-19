import { BaseAvailabilityVerifier } from './base/BaseAvailabilityVerifier'
import { ILogger } from '../../../Core/Logger/ILogger'
import { ApplicationHealthProviderItemName } from './types'
import { AppIoCContainer } from '../AppIoContainer'


/**
 * Класс для проверки доступности izi-pos
 */
export class IziPosAvailabilityVerifier extends BaseAvailabilityVerifier {

    public isRequired = true
    protected get thisId(): string {
        return 'IziPosAvailabilityVerifier'
    }

    public constructor(logger: ILogger) {
        super(logger, ApplicationHealthProviderItemName.isIziPosAvailable)
    }
    protected async verifyInternalAsync(): Promise<boolean> {
        try {
            const isPosVirtual = AppIoCContainer.getAppSettings().isVirtual
            if (isPosVirtual) {
                return true
            }

            const result = await new Promise(resolve => {
                const objectActivity = AppIoCContainer.getObjectActivityRegister()
                const minutes = this.getMinutes(objectActivity.LastPosActivityUpdate, new Date())
                this.logger.LogInfo(this.thisId, `Last POS activity update was ${minutes} minute(s) ago.`)
                const wait = setTimeout(() => {
                    clearTimeout(wait)
                    resolve(minutes < 2)
                }, 1000)
            })
            return result as Promise<boolean>
        }
        catch (error) {
            console.error("An error occurred:", error)
            return false
        }
    }

    private getMinutes = (startDate: Date, endDate: Date) => parseFloat((Math.abs(startDate.getTime() - endDate.getTime()) / (1000 * 60) % 60).toFixed(2))
}
