export interface IPosTerminalLinkWithBankErrorProvider {
    readonly connectionErrorCount: number;
    incrementConnectionErrorCount: () => void;
    cleanConnectionErrorCount: () => void;
}
