package com.izigo.smartsaleterminal.operations.reconciliationOfTotals;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityRequestBase;

public class ReconciliationOfTotalsRequest extends PosActivityRequestBase {
    public ReconciliationOfTotalsRequest(String terminalId) {
        super(PosTerminalOperation.RECONCILIATION_OF_TOTALS, terminalId);
    }
}
