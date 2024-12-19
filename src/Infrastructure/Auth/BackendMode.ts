
export const appEnvironmentValues = ['beta', 'prod', 'development'] as const
export type AppEnvironment = typeof appEnvironmentValues[number]
