import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './postType'
import { eventType } from './eventType'
import { eventForm } from './eventForm'
import { eventRegistration } from './eventRegistration'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, eventType, eventForm, eventRegistration],
}
