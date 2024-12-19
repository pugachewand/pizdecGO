import { PaymentServiceAdapter } from '../../Adapter/SmartSaleTerminalAdapter'

export const startPaymentReconciliation = async () => {
    const isSuccess = false
	const paymentService = new PaymentServiceAdapter()
    const responseEither = await paymentService.reconciliateOfTotals()
    console.log(responseEither)
    
    return isSuccess
}