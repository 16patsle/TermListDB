export type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P]
}
