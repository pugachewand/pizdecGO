export enum InjectScope {
	SINGLETON,
	TRANSIENT
}
export interface IIoCContainer<TYPES extends string> {
	register: <T extends object>(scope: InjectScope, interfaceO: TYPES, implementation: (c: IIoCContainer<TYPES>, ...args: any) => T) => boolean;
	unregister: (interfaceO: TYPES) => boolean;
	resolve: <T extends object>(interfaceO: TYPES, ...args: any) => T;
	isRegistered: (interfaceO: TYPES) => boolean;
}
export interface IIoCContainerPrivates<TYPES extends string> {
	registeredObjects: Record<string, {
		scope: InjectScope;
		implementation: ((c: IIoCContainer<TYPES>, ...args: any) => object)
	} | undefined>;
	singletonObjects: Record<string, object | undefined>;
}
