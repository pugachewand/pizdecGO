
const lceValues = ['loading', 'content', 'error'] as const
export type Lce = typeof lceValues[number]
