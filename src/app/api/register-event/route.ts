import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, candidateData } = body;

    if (!eventId || !candidateData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.SANITY_WRITE_TOKEN) {
      console.error('Missing SANITY_WRITE_TOKEN');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const writeClient = client.withConfig({
      token: process.env.SANITY_WRITE_TOKEN,
    });

    const newSubmission = {
      _key: Math.random().toString(36).substring(7) + Date.now().toString(36),
      registeredAt: new Date().toISOString(),
      status: 'confirmed',
      candidateData: Object.entries(candidateData).map(([key, value]) => ({
        _key: key + Math.random().toString(36).substring(7),
        key,
        value: String(value),
      })),
    };

    // Check if a registration document already exists for this event
    const existingRegistration = await writeClient.fetch(
      `*[_type == "eventRegistration" && event._ref == $eventId][0]`,
      { eventId }
    );

    if (existingRegistration) {
      // Append to the existing document
      await writeClient
        .patch(existingRegistration._id)
        .setIfMissing({ submissions: [] })
        .append('submissions', [newSubmission])
        .commit({ autoGenerateArrayKeys: true });
    } else {
      // Create a new document
      const doc = {
        _type: 'eventRegistration',
        event: {
          _type: 'reference',
          _ref: eventId,
        },
        submissions: [newSubmission],
      };
      await writeClient.create(doc);
    }

    return NextResponse.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to submit registration' }, { status: 500 });
  }
}
