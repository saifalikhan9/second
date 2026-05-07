'use server';
import { BASE_URL } from '@/lib/constants';
import { headers } from 'next/headers';

export const share = async (share: boolean) => {
  try {
    const res = await fetch(`${BASE_URL}/api/brain/share`, {
      method: 'POST',
      headers: {
        Cookie: (await headers()).get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ share }),
    });

    if (!res.ok) {
      throw new Error('Failed');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return 'failed';
  }
};

export const fetchedSharedURL = async (hash: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/brain/share/${hash}`, {
      method: 'GET',
      headers: {
        Cookie: (await headers()).get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return 'failed';
  }
};
