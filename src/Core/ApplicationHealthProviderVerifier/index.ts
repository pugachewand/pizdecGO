import { IApplicationHealthProviderVerifier, IApplicationHealthProviderVerifierResult } from './types';
import { ObjectExtension } from '../connections/MqttClient';

/**
 * Represents base class to verify object availability
 */
export abstract class ApplicationHealthProviderVerifier<TObjectIdType extends string> implements IApplicationHealthProviderVerifier {

    /**
     * Contains information about object id verify availability state, `true` - is in verify sate, otherwise `false`
     */
    private static isObjectIdInVerifyProgress: Record<string, boolean> = {}

    /**
     * Object id to verify availability
     */
    private _objectIdToVerify: TObjectIdType;

    /**
     * Last result of availability
     */
    private _lastAvailabilityResult: IApplicationHealthProviderVerifierResult;

    public get isInVerifyProgress() {
        return ApplicationHealthProviderVerifier.isObjectIdInVerifyProgress[this._objectIdToVerify] ?? false;
    }
    public set isInVerifyProgress(value: boolean) {
        if (value) {
            ApplicationHealthProviderVerifier.isObjectIdInVerifyProgress[this._objectIdToVerify] = value;
        }
        else {
            ObjectExtension.deleteProperty(ApplicationHealthProviderVerifier.isObjectIdInVerifyProgress, this._objectIdToVerify);
        }
    }

    public get objectId() {
        return this._objectIdToVerify;
    }

    public constructor(objectId: TObjectIdType) {
        this._objectIdToVerify = objectId;
        this.verifyAsync = this.verifyAsync.bind(this);
        this._lastAvailabilityResult = {
            objectId: this.objectId,
            isAvailable: false,
        };
    }
    public abstract isRequired: boolean;

    public abstract verifyProcessAsync(): Promise<IApplicationHealthProviderVerifierResult>;

    public async verifyAsync(): Promise<IApplicationHealthProviderVerifierResult> {
        if (this.isInVerifyProgress) {
            return this._lastAvailabilityResult;
        }

        this.isInVerifyProgress = true;

        try {
            this._lastAvailabilityResult = await this.verifyProcessAsync();
        }
        finally {
            this.isInVerifyProgress = false;
        }

        return this._lastAvailabilityResult;
    }
}
