import { defineField, defineType } from 'sanity'

export const eventForm = defineType({
  name: 'eventForm',
  title: 'Event Form Template',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal name for the form template (e.g. Default Form, Hackathon Form).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short intro text displayed above the form.',
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'fieldName', title: 'Field Name (Key)', type: 'string', description: 'e.g., fullName, problemStatement. Must be camelCase.', validation: (rule) => rule.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'Label displayed to the user.', validation: (rule) => rule.required() }),
            defineField({
              name: 'fieldType',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Text (Short)', value: 'text' },
                  { title: 'Text (Long/Textarea)', value: 'textarea' },
                  { title: 'Email', value: 'email' },
                  { title: 'Phone/Tel', value: 'tel' },
                  { title: 'URL', value: 'url' },
                  { title: 'Select/Dropdown', value: 'select' },
                  { title: 'Checkbox', value: 'checkbox' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'isRequired', title: 'Is Required?', type: 'boolean', initialValue: true }),
            defineField({
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Comma separated options or string array. Used only if Field Type is Select.',
              hidden: ({ parent }) => parent?.fieldType !== 'select',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'fieldName' },
          }
        },
      ],
    }),
  ],
})
