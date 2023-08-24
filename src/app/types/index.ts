export type Organization = string

export enum DocumentType {
  PASSPORT = 'паспорт', 
  ZAGRAN = 'загран. паспорт', 
  SVIDETELSTVO = 'св-во о рождении'
} 

export interface IDocument {
  id: number
  type: DocumentType
  serial: string
  number: string
  issueDate: Date
  organization: Organization
  orgCode: string
  isMain: boolean
  isArchive: boolean
}

export interface IFilter {
  type: DocumentType | null
  number: number | null
  showArhive: boolean
}

export type Nullable<T> = { [K in keyof T]: T[K] | null };
