import { createClient } from 'next-sanity';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('Error: SANITY_WRITE_TOKEN is missing in .env.local');
    process.exit(1);
  }

  console.log('Creating dummy event form...');
  const form = await client.create({
    _type: 'eventForm',
    title: 'Dummy Event Form with Photo',
    description: 'A test form for photo upload.',
    fields: [
      { _key: 'f1', fieldName: 'fullName', label: 'Full Name', fieldType: 'text', isRequired: true },
      { _key: 'f2', fieldName: 'email', label: 'Email Address', fieldType: 'email', isRequired: true },
      { _key: 'f3', fieldName: 'phone', label: 'Phone Number', fieldType: 'tel', isRequired: true },
      { _key: 'f4', fieldName: 'position', label: 'Position / Role', fieldType: 'text', isRequired: true },
      { _key: 'f5', fieldName: 'employerName', label: 'Employer / College Name', fieldType: 'text', isRequired: true },
    ]
  });

  console.log('Created form:', form._id);

  console.log('Fetching an existing image asset to use for banner validation...');
  const existingImage = await client.fetch(`*[_type == "sanity.imageAsset"][0]`);
  
  if (!existingImage) {
    console.error('No existing image assets found in Sanity. Please upload an image to any document in the Studio first, so the seed script can use it for the banner validation.');
    process.exit(1);
  }

  console.log('Creating dummy event...');
  const event = await client.create({
    _type: 'event',
    title: 'Dummy Test Event',
    slug: { _type: 'slug', current: 'dummy-test-event-' + Date.now() },
    eventDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week from now
    isUpcoming: true,
    venue: 'Test Venue',
    registrationLink: 'https://example.com',
    useNativeForm: true,
    formTemplate: { _type: 'reference', _ref: form._id },
    description: [
      { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'This is a test event for the photo upload feature.', marks: [] }], markDefs: [] }
    ],
    bannerImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: existingImage._id }
    },
  });

  console.log('Successfully created Dummy Event:', event._id);
}

main().catch(console.error);
