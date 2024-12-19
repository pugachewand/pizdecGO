import { ILogger } from '../../../Core/Logger/ILogger'
import { ApplicationHealthProviderItemName } from './types'
import { ObjectAvailabilityRepo } from '../../../Logic/RestApi/ObjectAvailabilityVerify/ObjectAvailabilityRepo'
import { BaseAvailabilityVerifier } from './base/BaseAvailabilityVerifier'


/**
 * Класс для проверки доступности endpoint-а API izipoint
 */
export class IzipointApiAvailabilityVerifier extends BaseAvailabilityVerifier {
    public isRequired = true
    protected get thisId(): string {
        return 'IzipointApiAvailabilityVerifier'
    }

    public constructor(logger: ILogger) {
        super(logger, ApplicationHealthProviderItemName.isAppServerAvailable)
    }

    protected async verifyInternalAsync(): Promise<boolean> {
        const checkConnectionApiProxy = new ObjectAvailabilityRepo()
        try {
            const result = await checkConnectionApiProxy.receiveIzipointApiPingAsync()
            if (result.value.isLeft()) {
                return false
            }

            return true
        }
        catch {
            return false
        }
    }
}
