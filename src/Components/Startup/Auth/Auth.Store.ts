import { AuthenticateEitherEntity, generateAuthRequest, generateAuthUuidRequest } from '../../../Logic/RestApi/Auth/AuthRepo.Types'
import { Right } from 'purify-ts/Either'
import { makeObservable, observable } from 'mobx'

import { AuthEnum } from './AuthEnum'
import { AuthScreenNavigationProps } from './Auth'
import forge from 'node-forge';
import { globalContext } from '../../../DependencyInjection/AppContext'
import { v1 as uuidv1 } from 'uuid';
import { useEmergencyReturn } from '../../../Infrastructure/EmergencyReturn';
import AppFlowStates from '../../../Machines/AppFlow/AppFlowStates';
import { EmergencyReturnTimerEnum } from '../../../Infrastructure/EmergencyReturn/EmergencyReturnTypes';

export class AuthStore {

	// #region dependencies
	private readonly eventBus = globalContext.eventBus.value

	private readonly authRepo = globalContext.restRepos.auth.value
	private readonly preferences = globalContext.preferences.value
	setCurrentFunction = useEmergencyReturn(AppFlowStates.Init, EmergencyReturnTimerEnum.AUTHORIZATION)
	private readonly moduleAndScreenInfo = {
		moduleName: AuthEnum.ModuleName,
		screenName: AuthEnum.AuthScreen,
	}

	// #endregion

	// #endregion
	isAuthentication = true
	// #region state

	// #endregion

	constructor(private readonly props: AuthScreenNavigationProps) {
		makeObservable(this, {
			isAuthentication: observable,
		})
	}


	componentDidMount = () => {
		this.eventBus.emit({
			analyticsCategory: 'ScreenTransitions',
			...this.moduleAndScreenInfo,
			functionalityName: AuthEnum.MountScreen,
			result: Right(null),
		})
		this.registerUuidAsync()
	}


	private readonly registerUuidAsync = async () => {
		this.setCurrentFunction('AuthStore > registerUuidAsync()')
		const uuid = uuidv1()
		const request = generateAuthUuidRequest(
			'RU',
			'RU',
			uuid,
		)
		const authEither = await this.authRepo.registerUuidAsync(request)
		if (authEither.value.isLeft()) {
			return authEither.value
		}
		const authResponse = authEither.value.unsafeCoerce()
		const start_key = forge.util.encode64(authResponse.password)
		const startKeyEither = await this.preferences.setStartKey(start_key)
		const uuidEither = await this.preferences.setUuid(uuid)
		await this.authenticateEitherAsync({authResponse, uuid})
		if (startKeyEither.isLeft()) {
			return startKeyEither
		}
		if (uuidEither.isLeft()) {
			return uuidEither
		}
		// TODO: если от бэка все ок то authResponse

		return Right(undefined)
	}
	private readonly authenticateEitherAsync = async (
		props: AuthenticateEitherEntity
	) => {

	  const request = generateAuthRequest(
		props.uuid,
		props.authResponse.password,
	  )
	  const authEither = await this.authRepo.authUser(request)
	  if (authEither.value.isLeft()) {
		return authEither.value
	  }
	  const response = authEither.value.unsafeCoerce()

	  const credentialsEither = await this.preferences.setCredentials(response)
	  if (credentialsEither.isLeft()) {
		return credentialsEither
	  }

	  return Right(undefined)
	}
}
