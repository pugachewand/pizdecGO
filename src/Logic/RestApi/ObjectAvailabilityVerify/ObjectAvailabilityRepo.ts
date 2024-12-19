import { AxiosConfigBuilder } from '../_Common/AxiosConfigBuilder';

export class ObjectAvailabilityRepo {

    receiveIzipointApiPingAsync = () =>
    new AxiosConfigBuilder('/api/values', 'GET')
        .toRequest()
        .performDefaultAsync()

}
