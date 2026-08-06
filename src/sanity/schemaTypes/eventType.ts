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
      name: 'formEmbedUrl',
      title: 'Registration Form Embed URL',
      description: 'Optional embeddable form URL (e.g. Tally.so or Google Form embed link) rendered inline on the event page.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
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
