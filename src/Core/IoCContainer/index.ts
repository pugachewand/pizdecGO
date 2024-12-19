import { ILogger } from "Core/Logger/ILogger";

import { IIoCContainer, IIoCContainerPrivates, InjectScope } from "./types";

const IoCContainerClass = (() => {
    const privateMembers = new WeakMap<object, IIoCContainerPrivates<string>>();

    class PrivateFieldsContainer<TYPES extends string> implements IIoCContainerPrivates<TYPES> {
        private registeredObjectsField: Record<string, {
            scope: InjectScope;
            implementation: ((c: IIoCContainer<TYPES>, ...args: any) => object)
        } | undefined>;

        private singletonObjectsField: { [key: string]: object | undefined };

        constructor() {
            this.registeredObjectsField = {};
            this.singletonObjectsField = {};
        }

        public get registeredObjects() {
            return this.registeredObjectsField;
        }

        public get singletonObjects() {
            return this.singletonObjectsField;
        }

        public static get<TYPES extends string>(iocContainer: IIoCContainer<TYPES>) {
            return privateMembers.get(iocContainer)!;
        }
    }


	class IoCContainer<TYPES extends string> implements IIoCContainer<TYPES> {
		private _logger: ILogger;

		private static get thisId() {
			return 'IoCContainer';
		}
		constructor(logger: ILogger) {
			privateMembers.set(this, new PrivateFieldsContainer<TYPES>());
			this._logger = logger;
			this.register = this.register.bind(this);
			this.unregister = this.unregister.bind(this);
			this.isRegistered = this.isRegistered.bind(this);
			this.resolve = this.resolve.bind(this);
		}
		public register<T extends object>(scope: InjectScope, interfaceO: TYPES, implementation: (c: IIoCContainer<TYPES>, ...args: any) => T): boolean {
			const { registeredObjects, singletonObjects } = PrivateFieldsContainer.get(this);
			if (singletonObjects[interfaceO] || registeredObjects[interfaceO]) {
				this._logger.LogError(IoCContainer.thisId, `Type [${interfaceO}] is already registered in IoC container.`);
				return false;
			}
			registeredObjects[interfaceO] = {
				scope,
				implementation,
			}
			return true
		}
		public unregister(interfaceO: TYPES): boolean {
			const { registeredObjects, singletonObjects } = PrivateFieldsContainer.get(this);
			if (registeredObjects[interfaceO]) {
				registeredObjects[interfaceO] = void 0;
				return true;
			}
			if (singletonObjects[interfaceO]) {
				singletonObjects[interfaceO] = void 0;
				return true;
			}

			return false;
		}

		public isRegistered(interfaceO: TYPES): boolean {
			const {registeredObjects, singletonObjects } = PrivateFieldsContainer.get(this)
			
			if (registeredObjects[interfaceO] || singletonObjects[interfaceO]) {
				return true;
			}

			return false
		}

		public resolve<T extends object>(interfaceO: TYPES, ...args: any): T {
			const { registeredObjects, singletonObjects } = PrivateFieldsContainer.get(this)

			let result = singletonObjects[interfaceO]
			if (result) {
				return result as T
			}

			let registered = registeredObjects[interfaceO]
			if (registered) {
				result = registered.implementation(this as any, args);
				if (registered.scope === InjectScope.SINGLETON) {
					registeredObjects[interfaceO] = undefined;
					singletonObjects[interfaceO] = result;
				}
			}

			if (result) {
				return result as T
			}

			throw new Error(`Type [${interfaceO}] is not registered in IoC container.\nResolved object from IoC container can not be undefined or null.`);

		}
	}
	return IoCContainer;
})();

export default function initDIContainer<TYPES extends string>(logger: ILogger): IIoCContainer<TYPES> {
    return new IoCContainerClass<TYPES>(logger);
}
