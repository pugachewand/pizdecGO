import { AxiosConfigBuilder } from "../_Common/AxiosConfigBuilder";


export class PosSettingsRepo {


    getSetting = (posToken: string) =>
        new AxiosConfigBuilder(`/api/SelfShopTerminal/getSstSettings?posToken=${posToken}`, 'GET').toRequest().performWithRefreshTokenPolicyAsync()
}
