import { IPaymentEntity, ISaveROTResult, UnpaidCheckPaymentResultEntity } from '../../../BackendEntities/Payment/PaymentRepoEntity';

import { AxiosConfigBuilder } from '../_Common/AxiosConfigBuilder';
import { ActiveBonusPromotionEntity, SimpleCheckEntity } from '../../../BackendEntities/Cart/PurchaseRepoEntity';

export class CheckRepo {

    payCheck = (props: IPaymentEntity) =>
    new AxiosConfigBuilder('/api/checks/payCheckExternal', 'POST')
        .withJson(props)
        .toRequest()
        .performWithRefreshTokenPolicyAsync<UnpaidCheckPaymentResultEntity>()

    getCheckByID = (checkId: number) =>
    new AxiosConfigBuilder(`/api/Checks/getCheck/${checkId}`, 'GET')
        .toRequest()
        .performWithRefreshTokenPolicyAsync<SimpleCheckEntity>()
    saveROTResult = (props: ISaveROTResult) =>
    new AxiosConfigBuilder(`/api/PosTerminals/addRotOperation`, 'POST')
        .withJson(props)
        .toRequest()
        .performWithRefreshTokenPolicyAsync<Boolean>()
    bonusPromotionByPosOperation = (PosOperationId: number) =>
        new AxiosConfigBuilder(`/api/BonusPromotions/posOperation/${PosOperationId}`, 'GET')
            .toRequest()
            .performWithRefreshTokenPolicyAsync<ActiveBonusPromotionEntity>()
}
