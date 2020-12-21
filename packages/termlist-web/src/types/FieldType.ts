export type RegularFieldType = {
  name: string
  type: 'short' | 'long' | 'date' | 'filler'
  immutable?: boolean
}
export type SelectFieldType = {
  name: string
  type: 'select'
  options: string[]
  immutable?: boolean
}

export type FieldType = RegularFieldType | SelectFieldType
