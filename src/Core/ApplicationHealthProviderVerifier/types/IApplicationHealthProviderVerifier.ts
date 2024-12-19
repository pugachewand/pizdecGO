import { IApplicationHealthProviderVerifierResult } from './IApplicationHealthProviderVerifierResult';

/**
 * Represents interface to verify availability of object
 */
export interface IApplicationHealthProviderVerifier {

    /**
     * Object ID to verify availability
     */
    readonly objectId: string;

    /**
     * Verifies availability of object
     * @returns Returns result of availability
     */
    verifyAsync(): Promise<IApplicationHealthProviderVerifierResult>;

    /**
     * If `true`, is a required, otherwise no
     */
    isRequired: boolean;
}
