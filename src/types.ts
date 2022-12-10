export type TODO = unknown
/** optionalize specific properties */

export type Optional<O, K extends keyof O> = {
  [P in keyof O]?: O[P]
} & Omit<O, K>
