import { defineField, defineType } from 'sanity'

export const eventRegistration = defineType({
  name: 'eventRegistration',
  title: 'Event Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'submissions',
      title: 'Submissions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'registeredAt',
              title: 'Registered At',
              type: 'datetime',
              initialValue: () => new Date().toISOString(),
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  { title: 'Confirmed', value: 'confirmed' },
                  { title: 'Waitlisted', value: 'waitlisted' },
                  { title: 'Cancelled', value: 'cancelled' },
                ],
              },
              initialValue: 'confirmed',
            }),
            defineField({
              name: 'candidateData',
              title: 'Candidate Data',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'key', title: 'Field Key', type: 'string' }),
                    defineField({ name: 'value', title: 'Field Value', type: 'text' }),
                  ],
                  preview: {
                    select: { title: 'key', subtitle: 'value' },
                  }
                },
              ],
            }),
          ],
          preview: {
            select: {
              date: 'registeredAt',
              status: 'status',
              data: 'candidateData',
            },
            prepare({ date, status, data }) {
              const nameField = data?.find((d: any) => d.key.toLowerCase().includes('name'))
              const title = nameField ? nameField.value : 'Registration'
              return {
                title,
                subtitle: `${date ? new Date(date).toLocaleDateString() : 'No date'} - ${status?.toUpperCase() || ''}`,
              }
            }
          }
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'event.title',
      submissions: 'submissions',
    },
    prepare({ title, submissions }) {
      const count = submissions?.length || 0;
      return {
        title: title ? `Registrations for ${title}` : 'Event Registrations',
        subtitle: `${count} submission${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
