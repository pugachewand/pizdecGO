import { ILogger } from '../../../../Core/Logger/ILogger'
import { ApplicationHealthProviderItemName } from '../types'
import { IApplicationHealthProviderVerifierResult } from '../../../../Core/ApplicationHealthProviderVerifier/types'
import { ApplicationHealthProviderVerifier } from '../../../../Core/ApplicationHealthProviderVerifier'


/**
 * Базовый класс для проверки доступности объекта
 */
export abstract class BaseAvailabilityVerifier extends ApplicationHealthProviderVerifier<ApplicationHealthProviderItemName> {

    protected logger: ILogger

    protected abstract get thisId(): string


    /**
     * Конструктор
     * @param logger
     * @param processId - ID объекта для проверки доступности
     */
    public constructor(logger: ILogger, processId: ApplicationHealthProviderItemName) {
        super(processId)
        this.logger = logger
    }

    /**
     * Метод для проверки доступности
     * @returns Возвращает `true`, если объект доступен
     */
    protected abstract verifyInternalAsync(): Promise<boolean>

    /**
     * Проверяет доступность объекта
     * @returns Возвращает результат проверки доступности объекта
     */
    public async verifyProcessAsync(): Promise<IApplicationHealthProviderVerifierResult> {
        const isAvailable = await this.verifyInternalAsync()
        return {
            objectId: this.objectId,
            isAvailable,
        }
    }
}
