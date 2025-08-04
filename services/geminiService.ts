
import type { ReadingRequest, ReadingResponse } from './types';

export async function generateReading(request: ReadingRequest): Promise<ReadingResponse> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      // Use the error message from the API, or create a default one
      throw new Error(data.message || `The psychic realm is cloudy. (HTTP ${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    // Re-throw the error so it can be caught and displayed by the UI component
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unexpected network error occurred while contacting the spirits.');
  }
}
