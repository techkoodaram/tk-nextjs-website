import { defineField, defineType } from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isUpcoming',
      title: 'Upcoming',
      description: 'Toggle off to hide this event from the announcement ribbon even if the date is in the future.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      description: 'Physical location name, or "Online".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mapLink',
      title: 'Map Link',
      description: 'Direct Google Maps or venue location link.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      initialValue: 'Register Now',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'role', title: 'Role', type: 'string' }),
        defineField({ name: 'phoneOrEmail', title: 'Phone or Email', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      description: 'Used as the hero image and the social share (OG) image. Ideal size 1200x630 for social sharing.',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) =>
        rule
          .required()
          .custom(async (value, context) => {
            const assetRef = value?.asset?._ref
            if (!assetRef) return true

            const client = context.getClient({ apiVersion: '2026-08-06' })
            const asset = await client.fetch(
              `*[_id == $id][0]{ "width": metadata.dimensions.width, "height": metadata.dimensions.height }`,
              { id: assetRef }
            )
            if (!asset?.width || !asset?.height) return true

            const targetRatio = 1200 / 630
            const actualRatio = asset.width / asset.height
            const withinTolerance = Math.abs(actualRatio - targetRatio) / targetRatio < 0.1

            if (!withinTolerance) {
              return `Image is ${asset.width}x${asset.height} (ratio ${actualRatio.toFixed(2)}). For best social sharing results use close to a 1200x630 (1.91:1) ratio.`
            }
            return true
          })
          .warning(),
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'gallery',
      title: 'Event Gallery',
      description: 'Photos from the event — typically added once the event has concluded.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    }),
    defineField({
      name: 'useNativeForm',
      title: 'Enable Native Form',
      description: 'Toggle on to use the native Sanity-backed form. Toggle off to use an external form link.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'externalFormUrl',
      title: 'External Form URL',
      description: 'Link for Google Forms or external registration links (used when Native Form is disabled).',
      type: 'url',
      hidden: ({ document }) => document?.useNativeForm === true,
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'formTemplate',
      title: 'Form Template',
      description: 'Select a reusable form template for this event.',
      type: 'reference',
      to: [{ type: 'eventForm' }],
      hidden: ({ document }) => document?.useNativeForm !== true,
    }),
    defineField({
      name: 'customFields',
      title: 'Custom Event Fields',
      description: 'Additional fields specific to this event (appended to the template fields).',
      type: 'array',
      hidden: ({ document }) => document?.useNativeForm !== true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'fieldName', title: 'Field Name (Key)', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
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
              hidden: ({ parent }) => parent?.fieldType !== 'select',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'fieldName' },
          }
        }
      ]
    }),
  ],
  orderings: [
    {
      title: 'Event Date, New',
      name: 'eventDateDesc',
      by: [{ field: 'eventDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', eventDate: 'eventDate', media: 'bannerImage' },
    prepare({ title, eventDate, media }) {
      const isUpcoming = eventDate ? new Date(eventDate) >= new Date() : false
      const dateLabel = eventDate
        ? new Date(eventDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'No date set'
      return {
        title,
        subtitle: `${dateLabel} · ${isUpcoming ? 'Upcoming' : 'Past'}`,
        media,
      }
    },
  },
})
