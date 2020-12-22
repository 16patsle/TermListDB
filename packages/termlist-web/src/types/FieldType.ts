import type { FieldNameType } from './FieldNameType'

export type RegularFieldType = {
  name: FieldNameType
  type: 'short' | 'long' | 'date' | 'filler'
  immutable?: boolean
}
export type SelectFieldType = {
  name: FieldNameType
  type: 'select'
  options: string[]
  immutable?: boolean
}

export type FieldType = RegularFieldType | SelectFieldType
