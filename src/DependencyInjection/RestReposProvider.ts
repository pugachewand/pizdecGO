import { AuthRepo } from '../Logic/RestApi/Auth/AuthRepo'
import { RestRepos } from './GlobalContext.Types'
import { Transient } from '../Logic/DI/Transient'

export const appRestRepos: RestRepos = {
	auth: new Transient(() => new AuthRepo()),
}
