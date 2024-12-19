import { AuthRequestEntity, RefreshTokenRequestEntity, RefreshTokenResponseEntity, UuidRequestEntity, UuidResponseEntity } from './AuthRepo.Types'

import { AxiosConfigBuilder } from '../_Common/AxiosConfigBuilder'

export class AuthRepo {

	static authRequestPath = '/connect/token'
	static uuidRequestPath = '/api/account/user/uuid'
	
	registerUuidAsync = (request: UuidRequestEntity) => 
		new AxiosConfigBuilder(AuthRepo.uuidRequestPath, 'POST')
			.withJson(request)
			.toRequest()
			.performDefaultAsync<UuidResponseEntity>()
	

	authUser = (request: AuthRequestEntity) =>
		new AxiosConfigBuilder(AuthRepo.authRequestPath, 'POST')
			.withUrlEncoded(request)
			.toRequest()
			.performDefaultAsync<RefreshTokenResponseEntity>()

	refreshToken = (req: RefreshTokenRequestEntity) =>
		new AxiosConfigBuilder(AuthRepo.authRequestPath, 'POST')
			.withUrlEncoded(req)
			.toRequest()
			.performDefaultAsync<RefreshTokenResponseEntity>()

}
