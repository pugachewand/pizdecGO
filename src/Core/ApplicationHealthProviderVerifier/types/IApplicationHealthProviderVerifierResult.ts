/**
 * Represents properties of availability of object
 */
export interface IApplicationHealthProviderVerifierResult {
    /**
     * Id object that been verified
     */
    objectId: string;

    /**
     * Returns `true`, when object is available
     */
    isAvailable: boolean;
}
