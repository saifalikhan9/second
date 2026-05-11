'use server';

import { BASE_URL } from '@/lib/constants';
import { headers } from 'next/headers';

export async function getContent() {
  try {
    const res = await fetch(`${BASE_URL}/api/contents`, {
      method: 'GET',
      headers: {
        Cookie: (await headers()).get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch contents');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: [],
      message: 'Failed to fetch contents',
    };
  }
}

export async function createContent(payload: {
  title: string;
  link: string;
  type: string;
}) {
  try {
    const res = await fetch(`${BASE_URL}/api/contents`, {
      method: 'POST',
      headers: {
        Cookie: (await headers()).get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Failed to create content');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function deleteContent(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/contents`, {
      method: 'DELETE',
      headers: {
        Cookie: (await headers()).get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function searchContent(query: string, limit = 10) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const res = await fetch(
      `${BASE_URL}/api/contents/search?query=${encodedQuery}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Cookie: (await headers()).get('cookie') || '',
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      throw new Error('Failed to search contents');
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: [],
      message: 'Failed to search contents',
    };
  }
}
