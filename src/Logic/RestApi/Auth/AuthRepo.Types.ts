/** @todo Всё, кроме функций в папку BackendEntities */

export const passwordGrantType = 'password'
export const refreshTokenGrantType = 'refresh_token'


export const authRequestDefaultScope = 'openid email name profile roles offline_access'

export type AuthRequestEntity = {
	grant_type: 'password' | 'refresh_token'
	scope: string
	username: string
	password: string
}
export type UuidRequestEntity = {
    Uuid: string
    CountryIso: string
    LanguageIso: string
}
export const generateAuthUuidRequest = (CountryIso: string, LanguageIso: string, Uuid: string): UuidRequestEntity => ({
	CountryIso,
	LanguageIso,
	Uuid,
})

export const generateAuthRequest = (username: string, password: string): AuthRequestEntity => ({
	grant_type: passwordGrantType,
	scope: authRequestDefaultScope,
	username,
	password,
})

export type AuthenticateEitherEntity = {
	authResponse: UuidResponseEntity,
	uuid: string 
}

export type RefreshTokenRequestEntity = {
	grant_type: 'password' | 'refresh_token'
	refresh_token: string
	scope: string
}

export const generateRefreshTokenRequest = (refresh_token: string, scope: string): RefreshTokenRequestEntity => ({
	grant_type: refreshTokenGrantType,
	refresh_token,
	scope,
})

export enum UserRegistrationStatusEntity {
    None = 0,
    PhoneNumberConfirmed = 1,
    BankingCardConfirmed = 2,
}

export interface UuidResponseEntity {
    password: string
    userPreviousRegistrationStatus: UserRegistrationStatusEntity
}

export type RefreshTokenResponseEntity = {
	scope: string
	token_type: string
	access_token: string
	expires_in: number
	id_token: string
	refresh_token: string
}

export type TokenExpiredResponseEntity = {
	error: string
	error_description: string
}
