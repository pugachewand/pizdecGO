import { CheckItemRequestEntity, IPurchaseInitiationResponse, PurchaseCancellationResultEntity, PurchaseInitiationRequestEntity, SimpleCheckEntity } from '../../../BackendEntities/Cart/PurchaseRepoEntity'

import {AxiosConfigBuilder} from '../_Common/AxiosConfigBuilder'
import { IAddOrDeleteCheckItemResponseEntity } from '../../../BackendEntities/Cart/ProductEntity';

const purchaseInitiateTimeout = 35000

export class PurchaseRepo {
  static addProduct = '/api/purchases/addCheckItem'
  static removeProduct = '/api/purchases/v2/deleteCheckItem'

  getFirstUnpaidCheck = () =>
  new AxiosConfigBuilder('/api/checks/firstUnpaidV2', 'GET')
    .withAllowedHttpCodes(404)
    .toRequest()
    .performWithRefreshTokenPolicyAsync<SimpleCheckEntity | null>()

  initiatePurchase = (request: PurchaseInitiationRequestEntity) =>
		// new AxiosConfigBuilder('/api/purchases/initiate', 'POST')
		new AxiosConfigBuilder('/api/purchases/terminalGo/initiate', 'POST')
			.withJson(request)
			.withTimeout(purchaseInitiateTimeout)
			.toRequest()
			.performWithRefreshTokenPolicyAsync<IPurchaseInitiationResponse>()

  addCheckItem = (request: CheckItemRequestEntity) =>
    new AxiosConfigBuilder(PurchaseRepo.addProduct, 'POST')
      .withJson(request)
      .toRequest()
      .performWithRefreshTokenPolicyAsync<IAddOrDeleteCheckItemResponseEntity>()

  deleteCheckItem = (request: CheckItemRequestEntity) =>
    new AxiosConfigBuilder(PurchaseRepo.removeProduct, 'DELETE')
      .withJson(request)
      .toRequest()
      .performWithRefreshTokenPolicyAsync<IAddOrDeleteCheckItemResponseEntity>()
      
  cancelMultiplePurchaseCheck = (posOperationId: number) =>
		new AxiosConfigBuilder(`/api/purchases/cancel/${posOperationId}`, 'POST')
			.toRequest()
			.performWithRefreshTokenPolicyAsync<PurchaseCancellationResultEntity>()
}
