import type { FieldNameType } from './FieldNameType'

export type RegularFieldType = {
  name: FieldNameType
  type: 'short' | 'long' | 'date'
  immutable?: boolean
}
export type SelectFieldType = {
  name: FieldNameType
  type: 'select'
  options: string[]
  immutable?: boolean
}
export type FillerFieldType = {
  name: ''
  type: 'filler'
  immutable: true
}

export type FieldType = RegularFieldType | SelectFieldType | FillerFieldType
